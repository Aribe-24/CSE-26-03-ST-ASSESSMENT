// defining the database structure
const mongoose = require ("mongoose");
const videxSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },

        description:{
            type: String,
            required: true
        },

        quality:{
            type: String,
            required: true
        },

        video:{
            type: String,
            required: true
        },

        thumbnail:{
            type: String,
            required: true
        }
    },
    {
        
            timestamps: true
});

module.exports = mongoose.model("videx", videxSchema);
