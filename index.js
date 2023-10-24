const express = require('express');
const usersRouter = require('./routes/users');
const objectsRouter = require('./routes/objects')
const reportsRouter = require('./routes/reports')
const violationsRouter = require('./routes/violations')
const bodyParser = require('body-parser')
const PORT = 5000;
const app = express();

app.use(express.json());
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