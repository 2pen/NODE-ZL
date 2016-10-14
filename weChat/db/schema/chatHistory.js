var mongoose = require('../db');
var Schema = mongoose.Schema;


var chatPersonSchema = new Schema({
    personOne:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    personTwo:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    personOneNotRead:Number,
    personTwoNotRead:Number,
    children: [{
        from:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        to:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        message:String,
        time:{type:Date,default:Date.now()}
    }]
})

module.exports = mongoose.model('chatPerson',chatPersonSchema);
