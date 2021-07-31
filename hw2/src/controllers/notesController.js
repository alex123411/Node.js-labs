const express = require('express');
const router = express.Router();

const {
    getNotesByUserId,
    addNoteToUser,
    getNoteById,
    updateUserNoteById,
    toggleCompletedForUserNoteById,
    deleteUserNoteById,
    countUserNotes
} = require('../services/notesService');

router.get('/', async (req, res) => {
    try{
        const { userId } = req.user;
        const offset = parseInt( req.query.offset, 10)
        const limit = parseInt( req.query.limit, 10)
        const [count, notes] = await Promise.all([
            countUserNotes(userId),
            getNotesByUserId(userId, offset, limit),
          ]);
        res.json({
            "offset": offset,
            "limit": limit,
            "count": count,
            notes
        
        });
    }  catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/', async (req, res) => {
    const { userId } = req.user;

    await addNoteToUser(userId, req.body);

    res.json({message: "Note created successfully"});
});

router.get('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        const note = await getNoteById(userId, id);
        if(note == 0){
            res.status(400).json({message: "Wrong note id"});
        } else {
            res.json({note});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        const note = await updateUserNoteById(userId, id, req.body);
        if(note == 0){
            res.status(400).json({message: "Wrong note id"});
        } else {
            res.json({message: "Success"});
        }
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        const note = await toggleCompletedForUserNoteById(userId, id);
        if(note == 0){
            res.status(400).json({message: "Wrong note id"});
        } else {
            res.status(200).json({"message": "Success"});
        }
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.id  

        const note = await deleteUserNoteById(userId, id);
        if(note == 0){
            res.status(400).json({message: "Wrong note id"});
        } else {
            res.json({message: "Success"});
        }
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = {
    notesRouter: router
}