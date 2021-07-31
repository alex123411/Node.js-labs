const {User} = require('../models/userModel');

const getProfileInfo = async (userId) => {
    
    try{
        const userInfo = await User.findById(userId);
        const user = {
            "_id": userInfo._id,
            "username": userInfo.username,
            "createdDate": userInfo.createdAt
        };
        return user;
    } catch (err){
        return 0;
    }
    
}

const deleteProfile = async (userId) => {
    await User.remove({ _id: userId });
}


const updateUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
  
    if (!user || oldPassword != user.password) {
      return 0;
    }
  
    
    await User.findByIdAndUpdate(userId, {$set: {
      password: newPassword,
    }});
  };

module.exports = {
    getProfileInfo,
    deleteProfile,
    updateUserPassword
};