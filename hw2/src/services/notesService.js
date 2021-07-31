const {Note} = require('../models/noteModel');

const getNotesByUserId = async (userId, offset, limit) => {
    const notes = await Note.find({userId})
        .skip(offset)
        .limit(limit);
    
    return notes;
}

const addNoteToUser = async (userId, notePayload) => {
    const note = new Note({...notePayload, userId});
    await note.save();
}

const getNoteById = async (userId, id) => {
    try{
        const note = await Note.findOne({userId, _id : id})
        return note
    } catch (err){
        return 0;
    }
}

const updateUserNoteById = async (userId, id, notePayload) => {
    try{
        await Note.findOneAndUpdate({userId:userId , _id: id}, {
            $set: {...notePayload},
          });
        return 1;
    } catch (err){
        return 0;
    }
}

const toggleCompletedForUserNoteById = async (userId, noteId) => {
    try{
        const note = await Note.findOne({userId, _id: noteId});
        note.completed = !note.completed;
        await note.save();
    } catch (err){
        return 0;
    }
  };
  
const deleteUserNoteById = async (userId, id) => {
    try{
        await Note.deleteOne({userId: userId, _id: id });
        return 1;
    } catch (err){
        return 0;
    }
}

const countUserNotes = async (userId) => await Note.count({userId});

module.exports = {
    getNotesByUserId,
    addNoteToUser,
    getNoteById,
    updateUserNoteById,
    toggleCompletedForUserNoteById,
    deleteUserNoteById,
    countUserNotes
};