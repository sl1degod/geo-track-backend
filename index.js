const express = require('express');
const usersRouter = require('./routes/users');
const objectsRouter = require('./routes/objects')
const reportsRouter = require('./routes/reports')
const violationsRouter = require('./routes/violations')
const postsRouter = require('./routes/posts')
const eliminationRouter = require('./routes/elimination')
const authRouter = require('./routes/auth')
const cors = require('cors')

const PORT = 5000;
const app = express();

process.env.TZ = 'Europe/Moscow';
const date = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
app.use(express.json());
app.use(cors())
app.use('/static/reports', express.static('image/reports/'))
app.use('/static/objects', express.static('image/objects/'))
app.use('/static/users', express.static('image/users/'))
app.use('/', usersRouter);
app.use('/', objectsRouter);
app.use('/', eliminationRouter);
app.use('/', reportsRouter);
app.use('/', violationsRouter);
app.use('/', postsRouter)
app.use('/', authRouter);

const start = () => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`)
    })
}

start();