const express = require('express');
const router = express.Router();
const {badRequestError, eternalServerError} = require('../errors')


const {
    getUserLoads,
    addUserLoad,
    getUserActiveLoad,
    iterateLoadState,
    postUserLoadById
    
} = require('../services/loadService');

router.get('/', async (req, res) => {
    try{
        const { userId } = req.user;
        const status = req.query.status
        const limit = parseInt( req.query.limit, 10)
        const offset = parseInt( req.query.offset, 10)
        
        const loads = await getUserLoads(userId, offset, limit, status)

        res.status(200).json({
            loads
        });
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

        await addUserLoad(userId, req.body);

        res.status(200).json({message: "LOAD created successfully"});
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

router.get('/active', async (req, res) => {
    try {
        const { userId } = req.user;

        const load = await getUserActiveLoad(userId);
        
        res.status(200).json({load});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

router.patch('/active/state', async (req, res) => {
    try {
        const { userId } = req.user;
        

        const state = await iterateLoadState(userId);
        
        res.json({message: `Load state changed to '${state}'`});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
        
    }
});

router.post('/:id/post', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        driver_found = await postUserLoadById(userId, id);
        
        res.status(200).json({"message": "Success", "driver_found": driver_found});
        
    } catch (err) {
        if (err.status == 400) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
        
    }
});

module.exports = {
    loadRouter: router
}