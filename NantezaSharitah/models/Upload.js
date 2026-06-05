const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const uploadSchema = new mongoose.Schema({
    title: {    
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('Upload', uploadSchema);