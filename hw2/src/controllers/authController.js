const express = require('express');
const router = express.Router();

const {
    registration,
    signIn
} = require('../services/authService');

router.post('/register', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        await registration({username, password});

        res.json({message: 'Account created successfully!'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const token = await signIn({username, password});
        if (token == 'Invalid username or password')
        {
            res.status(400).json({message: 'Invalid username or password'});
        } else{
            res.json({message: 'Success', "jwt_token": token});
        }
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});



module.exports = {
    authRouter: router
}