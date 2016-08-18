var mongoose = require('../db');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    meta:{
        updateAt:{type:Date,default:Date.now()},
        createAt:{type:Date,default:Date.now()}
    }
})

/* 用户定义*/
var newsSchema = new Schema({
    title: String,
    content: String,
    meta:{
        updateAt:{type:Date,default:Date.now()},
        createAt:{type:Date,default:Date.now()}
    },
    children: [commentSchema],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

newsSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    next();
})

module.exports = mongoose.model('News',newsSchema);