const mongoose = require('mongoose');

module.exports = (app) => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost:27017/trips', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        mongoose.set('useFindAndModify', false)
    
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.error('DB error: ' + err);
            reject(err);
        });
        db.once('open', function () {
            console.log('DB connected!');
            resolve();
        });
    }) ;
}