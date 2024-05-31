const crypto = require('crypto')
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
        require: [true, "Please fill the email field"],
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: String,

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        require: [true, "Password is required"],
        minlength: [8, "Your password should be at least 8 characters long."],
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm you password'],
        validate: {
            // this only work on coll^n.save()/create() not on findOne/update
            validator: function (el) {
                return el === this.password
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now();
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    };

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

        console.log({resetToken},this.passwordResetToken);

    this.passwordResetExpires = Date.now()+ 5 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('user', userSchema);
module.exports = User;