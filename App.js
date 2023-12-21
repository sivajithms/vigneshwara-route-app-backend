require("dotenv").config();

import express from 'express';
import cors from 'cors';

//database connection
import connectDB from './Database/connection'

//apis
import Auth from './API/Auth';

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.json("Hello world!!")
});

//for application routes
app.use('/auth', Auth);

app.listen(port, () => {
    connectDB()
        .then(() => console.log('server started at port', port))
        .catch((err) => console.log('DB connection failed', err))
});