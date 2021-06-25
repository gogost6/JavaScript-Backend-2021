const { MongoClient } = require('mongodb');
const connectionStr = 'mongodb://localhost:27017';
const client = new MongoClient(connectionStr, {
    useUnifiedTopology: true
});
client.connect((err) => {
    if(err!=null) {
        console.log('Someting unexprected happened!');
        return;
    }

    console.log('Database connected');

    const db = client.db('testdb2');
    const collection = db.collection('cats');
    collection.find({}).toArray((err, data) => {
        console.log(data);
    })
})
