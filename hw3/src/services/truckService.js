const {Truck} = require('../models/truckModel');
const {badRequestError} = require('../errors')

const getISTrucks = async () =>{
    return  Truck.find({status: 'IS'});
}

const setTruckStatus = async (assignedTo, newStatus) => {
    await Truck.findOneAndUpdate({assigned_to: assignedTo}, {status: newStatus});
}

const getDriversTruckById = async (userId) =>
  Truck.findOne({assigned_to: userId});


const getUserTrucks = async (userId) => {
    try{
    const trucks = await Truck.find({created_by: userId});
    return trucks;
    } catch (err){
        throw new badRequestError(err.message)    
    }
}

const addUserTruck = async (userId, truckPayload) => {
    try{
    const truck = new Truck({created_by: userId, ...truckPayload});
    await truck.save();
    } catch (err){
        throw new badRequestError(err.message)    
    }
}

const getUserTruckById = async (userId, id) => {
    try{
        const truck = await Truck.findOne({userId, _id : id})
        return truck
    } catch (err){
        throw new badRequestError('Wrong truck id')    
    }
}

const updateUserTruckById = async (userId, id, truckPayload) => {
    try{
        await Truck.findOneAndUpdate({userId:userId , _id: id}, {
            $set: {...truckPayload},
        });
    } catch (err){
        throw new badRequestError('Wrong truck id')    
    }
}
  
const deleteUserTruckById = async (userId, id) => {
    try{
        await Truck.deleteOne({userId: userId, _id: id });
    } catch (err){
        throw new badRequestError('Wrong truck id')    
    }
}

const assignUserTruckById = async (userId, truckId) => {
    try{
        await Truck.findOneAndUpdate({created_by:userId , _id: truckId}, {
            assigned_to: userId
        });
    } catch (err){
        throw new badRequestError('Wrong truck id')    
    }
  };

//const countUserNotes = async (userId) => await Note.count({userId});

module.exports = {
    getUserTrucks,
    addUserTruck,
    getUserTruckById,
    updateUserTruckById,
    deleteUserTruckById,
    assignUserTruckById,
    getDriversTruckById,
    setTruckStatus,
    getISTrucks
};