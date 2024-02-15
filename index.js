require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { default: MailSlurp } = require("mailslurp-client");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const mailslurp = new MailSlurp({
  apiKey: "7fea0fff298aa5624891d32ae3ff1f3a22afde5c4d866e50385ac9b8719962bc",
});

app.get("/", (req, res) => {
  res.send("Product server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// user name = temp-mail
// password = I7rv1VUzkiakP31P

async function insertDocument(email1, userCollection) {
  const { id: inboxId, emailAddress } =
    await mailslurp.inboxController.createInboxWithDefaults();

  // Insert document with timestamp field
  const document = {
    inboxId,
    email: email1,
    emailAddress,
  };

  await userCollection.insertOne(document);

  return { inboxId, emailAddress };
}

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const database = client.db("temp-mail");
    const user = database.collection("user");
    const userInfo = database.collection("userInfo");
    const article = database.collection("article");
    const review = database.collection("review");
    const notes = database.collection("notes");
    const blog = database.collection("blog");
    const comment = database.collection("comment");

    app.post("/create-inbox", async (req, res) => {
      try {
        const email1 = req.body;

        // Insert document into MongoDB collection
        const { inboxId, emailAddress } = await insertDocument(email1, user);

        res.status(200).json({ inboxId, emailAddress });
      } catch (error) {
        console.error("Error creating inbox:", error);
        res.status(500).json({ error: "Error creating inbox" });
      }
    });
    app.get("/get-emails/:inboxId", async (req, res) => {
      try {
        const inboxId = req.params.inboxId;
        console.log("inbox id", inboxId);
        // Retrieve emails for the specified inboxId
        const emails = await mailslurp.inboxController.getEmails({ inboxId });

        // Format the emails for response
        const formattedEmails = emails.map((email) => ({
          subject: email.subject,
          body: email.body,
        }));

        res.json(formattedEmails);
      } catch (error) {
        console.error("Error fetching emails. Error details:", error.message);
        res
          .status(500)
          .json({ error: "Error fetching emails", message: error.message });
      }
    });

    app.get("/users/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;
        const query = { "email.userEmail": userEmail }; // Adjust the property name accordingly

        const result = await userCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error fetching user" });
      }
    });

    app.get("/users", async (req, res) => {
      const result = await userInfo.find().toArray();
      res.send(result);
    });
    app.patch("/users", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userInfo.updateOne(filter, updatedDoc);
      res.send(result);
    });
    // checking users if exist or not exist
    app.post("/users", async (req, res) => {
      const userData = req.body;
      const query = { email: userData.email };
      const isUserExist = await userInfo.findOne(query);
      if (isUserExist) {
        return res.send({ message: "UserExist", InsertedId: null });
      }
      const result = await userInfo.insertOne(userData);
      res.send(result);
    });
    // ----------------- article api create ----------------
    app.get("/article", async (req, res) => {
      const result = await article.find().toArray();
      res.send(result);
    });

    app.get("/article/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await article.findOne(query);
      res.send(result);
    });
    app.put("/article/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const articles = req.body;
      const updatedDoc = {
        $set: {
          img: articles.img,
          title: articles.title,
          description: articles.description,
          shortDescription: articles.shortDescription,
          date: articles.data,
          whyToUse: articles.whyToUse,
          whereToUse: articles.whereToUse,
          useToHelp: articles.useToHelp,
          benefits: articles.benefits,
          suggestArticle: articles.suggestArticle,
          like: 0,
          comment: [],
        },
      };
      const result = await article.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.patch("/article/rejecte/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedDoc = {
        $set: {
          status: 'rejecte'
        },
      };
      const result = await article.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.put("/article/confirm/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      console.log(filter)
      const updatedDoc = {
        $set: {
          status: 'confrom'
        },
      };
      const result = await article.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/article/like", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: new ObjectId(id) };

      const pathData = {
        $inc: {
          like: +1,
        },
      };
      const result = await article.updateOne(filter, pathData);
      res.send(result);
    });

    app.delete("/article", async (req, res) => {
      const filter = { _id: new ObjectId(req.query.id) };
      const result = await article.deleteOne(filter);
      res.send(result);
    });
    app.post("/article", async (req, res) => {
      const result = await article.insertOne(req.body);
      res.send(result);
    });
    // ----------------- article api create ----------------

    // ----------------- review api create ----------------
    app.get("/review", async (req, res) => {
      const result = await review.find().toArray();
      res.send(result);
    });
    app.delete("/review", async (req, res) => {
      const filter = { _id: new ObjectId(req.query.id) };
      const result = await article.deleteOne(filter);
      res.send(result);
    });
    app.post("/review", async (req, res) => {
      const result = await review.insertOne(req.body);
      res.send(result);
    });
    // ----------------- review api create ----------------

    app.get("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await comment.find(filter).toArray();
      res.send(result);
    });
    app.post("/comment", async (req, res) => {
      const result = await comment.insertOne(req.body);
      res.send(result);
    });

    // ----------------- notes api create ----------------
    app.get("/notes", async (req, res) => {
      const email = req.query.email;
      const filter = { user_Email: email };
      const result = await notes.find(filter).toArray();
      res.send(result);
    });
    app.post("/notes", async (req, res) => {
      const result = await notes.insertOne(req.body);
      res.send(result);
    });
    // ----------------- notes api create ----------------
    // ----------------- blog api create ----------------
    app.get("/blog", async (req, res) => {
      const result = await blog.find().toArray();
      res.send(result);
    });
    // ----------------- blog api create ----------------

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
