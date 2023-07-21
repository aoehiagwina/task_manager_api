const {app} = require('./app')


const PORT =  process.env.PORT;


app.listen(PORT, () => {
    console.log('Server up at port ' + PORT)
})


//const auth = require('./middleware/auth')


// const User = require('./models/user.js')
// const Task = require('./models/task')





//middleware
//app.use(auth)

// const multer = require('multer');
// const upload = multer({
//     dest: 'images'
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })







