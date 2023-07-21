const request = require('supertest');
const {setDatabase, userOne, userOneID} = require('./fixtures/db')
const app = require('../src/app');
const User = require('../src/models/user');




//this clear the database before running the test
beforeEach(setDatabase)

//testing signup router
test('should sign up users', async () => { 
    const response = await request(app).post('/users/signup').send({
        name: "Auster Ehi",
        age: 28,
        email: "austerEhi32@gmail.com",
        password: "ehi556!!",
        sex: "male"
    }).expect(201)

    //Assertion that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion that about the response, to ensure there is a match
    expect(response.body).toMatchObject({
        user: {
            name: 'Auster Ehi',
            email: 'austerehi32@gmail.com'
        },
        token: user.tokens[0].token
    })
    
    //Assertion that password is correctly created
    expect(user.password).not.toBe("ehi556!!")

    //Assertion that password is correctly created
    expect(user.email).not.toBe("austerEhi32@gmail.com")
})

//testing user login
test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //Assert wether users are properly logged in
    const user = await User.findById(userOne._id)
    //expect(user.tokens[1].token).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})


//should not login nonexiting user
test('should not login non-existing user', async () => { 
    const nonExistingUser = {
        email: 'dhdhddh@gmail.com',
        password: 'shdhd74839'
    }

    await request(app)
        .post('/users/login')
        .send({
            email: nonExistingUser.email,
            password: nonExistingUser.password})
        .expect(400)
    }
)

//Testing for authorization and authentication
test('should test for aunthentication token', async () => { 
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
 })

//Testing to ensure unauthorize users have no access
 test('should test for aunthentication token', async () => { 
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
 })

//Testing to ensure authorized users can delete their account
test('Should delete authorized users account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assertion to verify user is deleted
    const user = await User.findById(userOne._id)
    expect(user).toBeNull();

})  

//Testing to ensure unauthorized users cannot delete any account
test('Should delete authorized users account', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

//Test for user uploads
test('should allow users upload avatar', async () => { 
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/know-gods-wisdom-from-lord-jesus-work-1650491773-480x270.jpg')
        .expect(200)

    //Ascertion to verify if avatar was correctly uploaded and stored in the database
    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
 })

 //Should update valid users
 test('should update valid user details', async () => { 
    const update = {
        name: "Auster Ehi",
        age: 28
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(201)

    //Ascertion to check is details were successfuly updated
    const user = await User.findById(userOneID)
    expect(user).toMatchObject(update)
})

// Should not update user
test('should not update user due to unathentication', async () => { 
    // const update = {
    //     name: 'aajombo',
    //     age: 46
    // }

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Liverpool'
        })
        .expect(400)
 })