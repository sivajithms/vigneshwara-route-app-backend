import express from 'express';
import { UserModel } from '../../Database/User'; 

const Router = express.Router();

Router.post('/signup', async (req, res) => {
    try {
        console.log(req.body.payload);
        await UserModel.findEmailAndPhone(req.body.payload);

        //DB
        const newUser = await UserModel.create(req.body.payload);

        //JWT token
        // const token = newUser.generateJwtToken();

        return res.status(200).json({ newUser });

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
});

Router.post('/signin', async (req, res) => {
    try {

        const user = await UserModel.findByEmailAndPassword(req.body.payload)

        //JWT token
        // const token = user.generateJwtToken();

        return res.status(200).json({ user, status: "success" });

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
});

export default Router;