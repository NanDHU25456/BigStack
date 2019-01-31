const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    profilepic: {
        type: String,
        default: "http://learncode0nline.in/man-icon"
    },
    date: {
        type: Date,
        default: Date.now

    }
});

module.exports = Person = mongoose.model("myperson", PersonSchema);