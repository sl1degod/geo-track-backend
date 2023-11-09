const express = require('express');
const usersRouter = require('./routes/users');
const objectsRouter = require('./routes/objects')
const reportsRouter = require('./routes/reports')
const violationsRouter = require('./routes/violations')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const PORT = 5000;
const app = express();

app.use(express.json());
app.use('/', usersRouter);
app.use('/', objectsRouter);
app.use('/', reportsRouter);
app.use('/', violationsRouter);
app.post('/upload', upload.single('image'), (req, res) => {
    const name = req.file.originalname;
    const path = req.file.path;

    // Вставляем информацию о картинке в базу данных
    pool.query('INSERT INTO images (name, path) VALUES ($1, $2)', [name, path])});
const start = () => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`)
    })
}

start();