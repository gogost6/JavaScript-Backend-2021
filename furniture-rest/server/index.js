const express = require('express');
const cors = require('./middlewares/cors');

const app = express();

const furnitureController = require('./controllers/furniture');
const userController = require('./controllers/users');
const database = require('./config/database');
const auth = require('./middlewares/auth');

start();

async function start() {

    app.use(cors());
    app.use(express.json());
    app.use(auth());
    
    await database(app);
    
    app.use('/data/catalog', furnitureController);
    app.use('/users', userController)
    
    app.get('/', (req, res) => res.send('It works'));
    
    app.listen(5000, () => console.log('Server is running on http://localhost:5000'));
}