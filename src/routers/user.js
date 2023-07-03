const express = require('express');
const sharp = require('sharp');
const auth = require('../middleware/auth')
const {welcomeMessage, cancellationMessage} = require('../emails/account')

const User = require('../models/user')
const router = new express.Router();

//Using multer to configure file upload
const multer = require('multer');
const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //Use this when using a javascript
        // if (!file.originalname.endsWith('.pdf')) {
        //     return cb(new Error('Please Upload a PDF file'))
        // }

        //Use this when using regex for document
        // if (!file.originalname.match(/\.(doc|docx)$/)) {
        //     return cb('Please, upload a Word Document')
        // }

        //Use this for image validation in regex
        if (!file.originalname.match(/\.(jpeg|jpg|png|JPG)$/)) {
            return cb(new Error('Please upload files with either JPEG, JPG, or PNG endpoint'))
        }

        cb(undefined, true)
    }
})


router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {

        await user.save();
        //sending welcome message
        welcomeMessage(user.email, user.name);
        //token generation for authentication
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email)
        if (!user) {
            return res.status(400).send('User not found')
        }
        const isMatch = await User.validateCredentials(req.body.password, user.password)
        if (!isMatch){
            return res.status(400).send('User not found')
        }
        
        const token = await user.generateAuthToken()


        res.send({ user, token})


    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })

        await req.user.save()

        res.status(200).send();

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens.length = 0;
        if (req.user.tokens.length > 0) {
            throw new Error()
        }

        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)

})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send('No user found')
//         }

//         res.status(200).send(user)

//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'age', 'sex', 'email', 'password']
    const isValidated = updates.every((update) => allowed.includes(update));

    if (!isValidated) {
        return res.status(400).send('error: item not recognised')
    }

    try {
        const user = req.user
        //for accessing what was updated so we can hash the password if updated
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        
        cancellationMessage(user.email, user.name);

        res.status(200).send(user + 'Deleted Sucessfully')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//user upload router
//resizing and formatting image files using sharp
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer;
    await req.user.save()
    res.send('Successful upload')
}, (error, req, res, next) => {
    res.status(400).send({'error': error.message})
})

//deleting avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save();
    res.status(200).send('Delete Successfully')
}, (error, req, res, next) => {
    res.status(400).send({'error': error.message})
})

//Serving up files
router.get('/users/:id/avatar', async (req, res) => {
    try {
            
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
        throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
    } catch (error) {
        res.status(404).send('')
    }

})

module.exports = router