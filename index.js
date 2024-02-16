require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { default: MailSlurp } = require('mailslurp-client');
const bodyParser = require('body-parser');
// Specify the path to the FFmpeg executable
//const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
//const server = http.createServer(app);
//const socketIo = require('socket.io');
//const { default: axios } = require('axios');
//const io = socketIo(server);
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Product server is running');
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

// user name = temp-mail
// password = I7rv1VUzkiakP31P





const uri = `mongodb+srv://temp-mail:I7rv1VUzkiakP31P@cluster0.lu7tyzl.mongodb.net/?retryWrites=true&w=majority`;

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
        const database = client.db('temp-mail')
        const user = database.collection('user')
        const userInfo = database.collection('userInfo')
        const article = database.collection('articles')
        const apiKey = database.collection('apiKey')

        // const verifyToken = (req, res, next) => {
        //     if (!req.headers.authorization) {
        //         return res.status(401).send({ message: 'Unauthorized access' });
        //     }
        //     const token = req.headers.authorization.split(' ')[1];
        //     jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        //         if (err) {
        //             return res.status(401).send({ message: 'Unauthorized access' });
        //         }
        //         req.decoded = decoded;
        //         next();
        //     });
        // };

        // const getUserRole = async (req, res, next) => {
        //     const email = req.decoded.email;
        //     const query = { userEmail: email };
        //     const user = await userInfo.findOne(query);
        //     if (user) {
        //         req.userRole = user.role;
        //         next();
        //     } else {
        //         res.status(403).send({ message: 'Forbidden access' });
        //     }
        // };


        // const verifyUserRole = async (req, res, next) => {
        //     const email = req.decoded.email;
        //     const query = { userEmail: email };
        //     const user = await userInfo.findOne(query);
        //     const isAdmin = user?.role === 'admin';
        //     // const pUser = user?.role === 'pUser'
        //     if (!isAdmin) {
        //         return res.status(403).send({ message: 'forbidden access' });
        //     }
        //     next();
        // }


        app.get('/all-users', async (req, res) => {
            const result = await userInfo.find().toArray();
            res.send(result);
        });


        // app.post('/jwt', async (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
        //     res.send({ token })
        // })


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;

            if (email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const query = { userEmail: email };
            const user = await userInfo.findOne(query);
            let admin = "admin";
            let pUser = "pUser";
            let ordUser = "user"
            if (user) {
                admin = user?.role === 'admin';
                pUser = user?.role === 'pUser';
                ordUser = user?.role === 'user'
            }
            res.send({ admin, pUser, ordUser });
        })


        const getDynamicApiKey = async () => {

            const result = await apiKey.find().toArray();
            const apiKeyValue = result[0]?.apiKey;
            const mailSlurp = new MailSlurp({ apiKey: apiKeyValue });

            app.post('/create-inbox', async (req, res) => {
                try {
                    const email1 = req.body;
                    const { inboxId, emailAddress } = await insertDocument(email1, user);

                    res.status(200).json({ inboxId, emailAddress });
                } catch (error) {
                    console.error('Error creating inbox:', error);
                    res.status(500).json({ error: 'Error creating inbox' });
                }
            });

            async function insertDocument(email1, userCollection) {
                const { id: inboxId, emailAddress } = await mailSlurp.inboxController.createInboxWithDefaults();

                const document = {
                    inboxId,
                    email: email1,
                    emailAddress,
                };

                await userCollection.insertOne(document);

                return { inboxId, emailAddress };
            }


            app.get('/get-emails/:inboxId', async (req, res) => {
                try {
                    const inboxId = req.params.inboxId;
                    const emails = await mailSlurp.inboxController.getEmails({ inboxId });
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



            // send email
        }

        getDynamicApiKey();

        app.get('/mailSlurp', async (req, res) => {
            const result = await apiKey.find().toArray();
            const apiKeyValue = result[0]?.apiKey;
            res.send(apiKeyValue)
        })


        app.get("/users/:email", async (req, res) => {
            try {
                const userEmail = req.params.email;
                const query = { "email.userEmail": userEmail }; // Adjust the property name accordingly

                const result = await user.findOne(query);
                res.send(result);
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).json({ error: 'Error fetching user' });
            }
        });

        // checking users if exist or not exist 

        app.post("/check-user", async (req, res) => {
            const userData = req.body
            const query = { userEmail: userData.userEmail }
            const isUserExist = await userInfo.findOne(query);
            if (isUserExist) {
                return res.send({ message: 'UserExist', InsertedId: null })
            }
            const result = await userInfo.insertOne(userData)
            res.send(result)
        })



        app.get('/article', async (req, res) => {
            const result = await article.find().toArray();
            res.send(result)
        })

        app.get('/article/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await article.findOne(query);
            res.send(result)
        })

        // text extractor from pdf file

    

       

        app.post('/api/convertToPdf', (req, res) => {
            const { textInput, allStyles } = req.body;
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
            doc.pipe(res);

            allStyles?.forEach(st => {
                doc.font('Helvetica');
                doc.fontSize(st.fontSize || 12);
                doc.fillColor(st.textColor || 'black');
                doc.text(textInput, { align: st.align || 'left' });
            });

            doc.end();
        });

        app.get('/createdInboxes', async (req, res) => {
            const result = await user.find().toArray();
            res.send(result)
        })

        app.patch('/updateApi/:apiKey', async (req, res) => {
            try {
                const apiKey2 = req.params.apiKey;
                const filter = { apiKey: apiKey2 };
                const options = { upsert: true };
                const updatedService = req.body;
                const updateFields = {
                    $set: {
                        apiKey: updatedService.apiKey
                    }
                };
                const result = await apiKey.updateOne(filter, updateFields, options);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });








        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


