const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name :{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password: {type:String,required:true},
    pic: {
        type:String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
},{
    timestamps : true
})

userSchema.methods.matchPassword = async function(enteredPassword){
    console.log("Password was checked");
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // Skip if password is not modified
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(this.password);
        return next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model("User",userSchema);

module.exports = User;