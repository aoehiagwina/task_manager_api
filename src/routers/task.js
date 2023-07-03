const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(501).send(error.message);
    }
})

//Working of sorting out data sent back using GET:/tasks?completed=true
//Working of limiting and skipping data sent back using GET:/tasks?limit=1&skip=20
//Working on sorting the order data are sent back GET:/tasks?sortBy=completed:1
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(501).send(error.message);
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(400).send('No Task with that ID number')
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(501).send(error.message);
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ['description', 'completed'];

    const isValidated = updates.every((update) => allowed.includes(update))

    if(!isValidated) {
        return res.status(500).send('Error: Item not included in model')
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true} )

        if (!task) {
            return res.status(400).send('No item with that ID')
        }
        
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.status(201).send(task + 'Updated Succesfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        //const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(400).send('No item with that ID')
        }

        res.status(200).send(task + 'Deleted Successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = router;