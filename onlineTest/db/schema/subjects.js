var mongoose = require('../db');
var Schema = mongoose.Schema;

var subjectsSchema = new Schema({
    course:String,
    startTime:Date,
    lastTime:Number,//以分钟为单位
    numOfQuestions:Number,
    questions:[{
        index:Number,
        question:String,
        score:Number
    }]
});

module.exports = mongoose.model('Subjects', subjectsSchema);

