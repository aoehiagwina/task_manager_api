const express =  require('express');
require('./db/mongoose')

//const auth = require('./middleware/auth')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// const User = require('./models/user.js')
// const Task = require('./models/task')

const app = express();

const PORT =  process.env.PORT;

//middleware
//app.use(auth)

const multer = require('multer');
const upload = multer({
    dest: 'images'
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})




app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(PORT, () => {
    console.log('Server up at port ' + PORT)
})