const jwt = require('jsonwebtoken');

const {User} = require('../models/userModel');

const registration = async ({username, password}) => {
    const user = new User({
        username,
        password
    });
    await user.save();
}

const signIn = async ({username, password}) => {
    const user = await User.findOne({username});

    if (!user) {
        return('Invalid username or password');
    }

    if (!(password == user.password)) {
        return('Invalid username or password');
    }

    const token = jwt.sign({
        _id: user._id,
        username: user.username
    }, 'secret');
    return token;
}

  


module.exports = {
    registration,
    signIn
};