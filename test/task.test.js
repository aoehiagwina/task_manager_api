const request = require('supertest');
const app = require('../src/app');
const {setDatabase, 
    userOne, 
    userOneID,
    taskOne,
    taskTwo,
    taskThree, 
    userTwo} = require('./fixtures/db')
const Task = require('../src/models/task')

//this clear the database before running the test
beforeEach(setDatabase)

test('should create a task', async () => { 
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Code a bit',
            completed: true
        })
        .expect(201)

    //assertion
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
})

//test to return all task for user one
test('should return all task', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assertion to check array
    expect(response.body.length).toEqual(2)
})


//attempt to delete second user task
test('should return fail', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)

    //Assertion to check array
    // expect(res).not.toBeNull()

    //Assertion the task is till in the database
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})