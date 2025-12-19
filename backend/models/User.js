const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String,required:true, unique: true},
    status:{type:String, default: ""},
    password:{type:String , required:true},
    profileImage: { type: String, default: "" },
    role: { type: String, default: "user" }

});

module.exports = mongoose.model("user",userSchema)
