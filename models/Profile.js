const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'myperson'
    },
    username: {
        type: String,
        required: true,
        max: 50
    },
    country: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    languages: {
        type: [String],
        required: true
    },
    portfolio: {
        type: String
    },
    workrole: [{
        role: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        From: {
            type: Date,

        },
        to: {
            type: Date,
            default: Date.now
        }

    }],
    socialmedia: {
        youtube: {
            type: String,
        },
        facebook: {
            type: String
        },
        Insta: {
            type: String
        }
    }
});

module.exports = Profile = mongoose.model("myprofile", ProfileSchema);