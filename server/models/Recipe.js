const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'This is required.'
    },
    discription:{
        type: Array,
        required: 'This is required.'
    },
    ingredients:{
        type: Array,
        required: 'This is required.'
    },
    image:{
        type: String
    },
    category:{
        type: String,
        enum: ["American", "Chinese", "Indian", "Mexican", "Spanish", "Thai"],
        required: 'This is required.'
    }
    
})

RecipeSchema.index({ name: "text", discription: "text"});

module.exports = mongoose.model('Recipe', RecipeSchema)