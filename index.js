const express = require('express');
const usersRouter = require('./routes/users');
const objectsRouter = require('./routes/objects')
const reportsRouter = require('./routes/reports')
const violationsRouter = require('./routes/violations')
const PORT = 5000;
const app = express();
process.env.TZ = 'Europe/Moscow';
const date = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
app.use(express.json());
app.use('/static/reports', express.static('image/reports/'))
app.use('/static/objects', express.static('image/objects/'))
app.use('/', usersRouter);
app.use('/', objectsRouter);
app.use('/', reportsRouter);
app.use('/', violationsRouter);

const start = () => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`)
    })
}

start();