const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type:String, required: true},
    description: { type:String },
    image: {type:String},
    videoId: { type:String, required: true},
    level: { type:String},
    students_count: { type:Number},
    slug: { type: String, slug: "name",  unique: true },
    duration: { type:String, required: true},

},{
    timestamps:true,
})
mongoose.plugin(slug);
module.exports = mongoose.model('Course', Course)