const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


//standby user1 for testing other endpoint
const userOneID = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneID,
    name: "Austine James",
    age: 30,
    email: "lordauster1@gmail.com",
    password: "Austine123",
    sex: "male",
    tokens: [{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

//standby user2 for testing other endpoint
const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoID,
    name: "Angela Jerry",
    age: 30,
    email: "aogtyui@gmail.com",
    password: "Austino456",
    sex: "female",
    tokens: [{
        token: jwt.sign({_id: userTwoID}, process.env.JWT_SECRET)
    }]
}

const taskOne = new Task({
    _id: new mongoose.Types.ObjectId(),
    description: 'Have a nap soon',
    completed: false,
    owner: userOneID
})

const taskTwo = new Task({
    _id: new mongoose.Types.ObjectId(),
    description: 'Make a call soon',
    completed: true,
    owner: userTwoID
})

const taskThree = new Task({
    _id: new mongoose.Types.ObjectId(),
    description: 'user one second task soon',
    completed: true,
    owner: userOneID
})


const setDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany()
    await new User(userOne).save();
    await new User(userTwo).save();

    await new Task(taskOne).save();
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    setDatabase,
    userOne,
    userTwo,
    userOneID,
    userTwoID,
    taskOne,
    taskTwo,
    taskThree
}