const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://sanghpark1:duN0pUFsKdhy31Z4@cluster0.2vkeyf3.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Solo-Project'
})
.then(() => console.log('Successfully connected to database'))
.catch((err) => console.log('Failed to connect: ', err));

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

const User = mongoose.model("users", userSchema);

const entrySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
})

const Entry = mongoose.model("journal_entries", entrySchema);

module.exports = {
    User,
    Entry
}