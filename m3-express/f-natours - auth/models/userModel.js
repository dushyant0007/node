const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill up your name'],
        trim: true
    },
    email: {
        type: String,
        require:[true,"Please fill the email field"],
        unique:[true,"Email already exists"],
        validate: [validator.isEmail,"Please provide a valid email"]
    },
    photo: String,
    password:{
        type:String,
        require:[true,"Password is required"],
        minlength:[8,"Your password should be at least 8 characters long."],
        select:false
    },
    passwordConfirm: {
        type: String,
        require: [true,'Please confirm you password'],


        validate: {
            // this only work on coll^n.save()/create() not on findOne/update
            validator: function(el){
                return el === this.password
            }
        }
    },
    passwordChangedAt: Date
});


userSchema.pre('save',async function(next)
{
    if(!this.isModified('password')) {next() ; return ; };

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;

    next();
});


userSchema.methods.correctPassword = async function(candidatePassword,userPassword)
{
    return await bcrypt.compare(candidatePassword , userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp)
{
    if (this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime())/1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

const User = mongoose.model('user',userSchema);
module.exports = User;