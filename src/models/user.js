const mongoose = require('mongoose')
//password security using bcryptjs
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const validator = require('validator');
const Task = require('./task');
const { Binary } = require('mongodb');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email not valid')
            }
        }
    },
    password: {
        type:String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password') || value.length < 6){
                throw new Error('Password unacceptable. Password must be greater than 6 items')
            }

        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error('Please input a valid age')
            }
        }
    },
    sex: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Setting up logging method by creating a new method
userSchema.statics.findByCredentials = async (email) => {
    const user = User.findOne({email});
    
    if (!user || user === null) {
        throw new Error('Unable to login, check login details');
    }

    return user
}
// Method for generating authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET); //this is a secret we use for token generation

    //Concatenate the generated token to the database so we can keep track of it
    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token
}

//Method for hiding private information sent to user
userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//comparing password with hashed password
userSchema.statics.validateCredentials = async (password, userpassword) => {
    const isMatch = await bcryptjs.compare(password, userpassword)

    return isMatch
}

//Hashing password before saving it we use the old fashion function
userSchema.pre('save', async function (next) {
    const user = this

    if (this.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }

    next()
})

//User middleware for deleting all tasks of a user when the user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User; 