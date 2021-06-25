const mongoose = require('mongoose');

start();

async function start() {
    const client = await mongoose.connect('mongodb://localhost:27017/testdb2', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('DB connected');

    const catSchema = new mongoose.Schema({
        name: String,
        color: String
    });

    const Cat = mongoose.model('Cat', catSchema);
    
    const myCat = new Cat({
        name: "Jerry",
        color: "Orange"
    });
    //await myCat.save();
    
    const data = await Cat.find({});
    console.log(data);
}