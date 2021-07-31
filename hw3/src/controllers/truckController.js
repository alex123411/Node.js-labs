const express = require('express');
const router = express.Router();
const {badRequestError, eternalServerError} = require('../errors')


const {
    getUserTrucks,
    addUserTruck,
    getUserTruckById,
    updateUserTruckById,
    deleteUserTruckById,
    assignUserTruckById
} = require('../services/truckService');

router.get('/', async (req, res) => {
    try{
        const { userId } = req.user;
        const trucks = await getUserTrucks(userId)
        res.status(200).json({trucks: trucks});
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

router.post('/', async (req, res) => {
    try{ 
        const { userId } = req.user;

        await addUserTruck(userId, req.body);

        res.status(200).json({message: "Truck created successfully"});
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        const truck = await getUserTruckById(userId, id);
        
        res.status(200).json({truck});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        await updateUserTruckById(userId, id, req.body);
        
        res.status(200).json({message: "Success"});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
        
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        await deleteUserTruckById(userId, id);
        
        res.status(200).json({message: "Success"});
        
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
        
    }
});

router.post('/:id/assign', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        await assignUserTruckById(userId, id);
        
        res.status(200).json({"message": "Success"});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
        
    }
});

module.exports = {
    truckRouter: router
}