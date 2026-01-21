const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String,required:true, unique: true},
    status:{type:String, default: ""},
    password:{type:String , required:true},
    profileImage: { type: String, default: "" },
    role: { type: String, default: "user" },
    watchStats: {
        kitchen: { type: Number, default: 0 },
        bakery: { type: Number, default: 0 },
        butchery: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        watched: {
            kitchen: [{ type: Schema.Types.ObjectId, ref: 'lessonvideo' }],
            bakery: [{ type: Schema.Types.ObjectId, ref: 'lessonvideo' }],
            butchery: [{ type: Schema.Types.ObjectId, ref: 'lessonvideo' }],
            all: [{ type: Schema.Types.ObjectId, ref: 'lessonvideo' }],
        }
    }

});

module.exports = mongoose.model("user",userSchema)
