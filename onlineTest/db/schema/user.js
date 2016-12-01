var mongoose = require('../db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId:String,
    username: String,
    password: String,
    status:String,
    identity:String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    }
});

userSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();
})

module.exports = mongoose.model('User', userSchema);
