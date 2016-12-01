var mongoose = require("../db");
var Schema = mongoose.Schema;

var answersSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User' },
    subject:{type:Schema.Types.ObjectId,ref:'Subjects'},
    questions:[{
        index:Number,
        content:String,
        score:Number 
    }]
});
module.exports = mongoose.model('Answers',answersSchema);
