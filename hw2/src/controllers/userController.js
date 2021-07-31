const express = require('express');
const router = express.Router();

const {
    getProfileInfo,
    deleteProfile,
    updateUserPassword
} = require('../services/userService');

router.delete('/', async (req, res) => {
    try{
        const { userId } = req.user;

        await deleteProfile(userId);

        res.status(200).json({message: ("Success")});
    } catch (err){
        res.status(500).json({message: err.message});
    }
    
});

router.get('/', async (req, res) => {
    try{
        const { userId } = req.user;

        const user = await getProfileInfo(userId);
        if (user == 0) {
            res.status(400).json({message: "no info about this user"});
        }
        else{
            res.json({user});
        }
        
    } catch (err){
        res.status(500).json({message: err.message});
    }
    
});

router.patch('/', async (req, res) => {
    try {
        const { userId } = req.user;
        const {
            oldPassword,
            newPassword
        } = req.body;

        const resp = await updateUserPassword(userId, oldPassword, newPassword);
        if (resp == 0){
            res.status(400).json({message: 'Invalid password or User does not exist'});
        } else {
            res.status(200).json({message: 'Success!'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = {
    userRouter: router
}