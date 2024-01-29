require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require('express');
const cors = require('cors');
const { default: MailSlurp } = require('mailslurp-client');
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const mailslurp = new MailSlurp({ apiKey: "0e90405e8317534d4994b1d46c701d7fa93825e915954e840b800abfff31587a" });

app.get('/', (req, res) => {
    res.send('Product server is running');
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

// user name = temp-mail
// password = I7rv1VUzkiakP31P


async function insertDocument(email1, userCollection) {
    const { id: inboxId, emailAddress } = await mailslurp.inboxController.createInboxWithDefaults();
    
    // Insert document with timestamp field
    const document = {
        inboxId,
        email: email1,
        emailAddress,
        createdAt: new Date() // Adding a timestamp field
    };
    
    await userCollection.insertOne(document);
    
    return { inboxId, emailAddress };
}


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        const userCollection = client.db('temp-mail').collection('user')
        const articleCollection = client.db('temp-mail').collection('article')

        await userCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 }); // TTL of 5 minutes (300 seconds)


        app.post('/create-inbox', async (req, res) => {
            try {
                const email1 = req.body;
                
                // Insert document into MongoDB collection
                const { inboxId, emailAddress } = await insertDocument(email1, user);
                
                res.status(200).json({ inboxId, emailAddress });
            } catch (error) {
                console.error('Error creating inbox:', error);
                res.status(500).json({ error: 'Error creating inbox' });
            }
        });
        app.get('/get-emails/:inboxId', async (req, res) => {
            try {
                const inboxId = req.params.inboxId;
        
                // Retrieve emails for the specified inboxId
                const emails = await mailslurp.inboxController.getEmails({ inboxId });
        
                // Format the emails for response
                const formattedEmails = emails.map(email => ({
                    subject: email.subject,
                    body: email.body,
                }));
        
                res.json(formattedEmails);
            } catch (error) {
                console.error('Error fetching emails. Error details:', error.message);
                res.status(500).json({ error: 'Error fetching emails', message: error.message });
            }
        });
        
        app.get("/users/:email", async (req, res) => {
            try {
                const userEmail = req.params.email;
                const query = { "email.userEmail": userEmail }; // Adjust the property name accordingly

                const result = await userCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).json({ error: 'Error fetching user' });
            }
        });

        app.get('/article', async(req, res) =>{
            const result = await articleCollection.find().toArray()
            res.send(result)
        })
        app.get('/article', async(req, res) =>{
            const result = await articleCollection.find().toArray()
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


