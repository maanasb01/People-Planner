const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    activeLog:{
        type: Schema.Types.ObjectId,
        ref:'activitylog',
    },
    role:{
        type:String,
        default:'member',
        enum:['member','manager']
    },
    managerId:{
        type: Schema.Types.ObjectId,
        ref:'user',
        default:null,
    }
},
{timestamps:true});

module.exports = mongoose.model('user',userSchema)