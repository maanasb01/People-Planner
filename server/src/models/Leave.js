const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaveSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    userName:{
        type:String,
    },
    managerId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    leavetype:{
        type:String,
        required:true,
        enum:["regular","halfDay"]
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending', 'approved', 'denied', 'cancelled']
    }
},{timestamps:true});

module.exports = mongoose.model('leaves',leaveSchema);