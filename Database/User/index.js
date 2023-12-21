import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
}, { timestamps: true });
 
UserSchema.statics.findEmailAndPhone = async ({ email }) => {

    //check whether email or phone number exists
    const checkUserByEmail = await UserModel.findOne({ email });

    if (checkUserByEmail) {
        throw new Error("user already exists");
    }
    return false;
};

UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({ user: this._id.toString() }, "SangoApp")
};

UserSchema.pre('save', function (next) {
    const user = this;

    //password is not modified
    if (!user.isModified('password')) return next();

    //generating bcrypt salt
    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        //hashing the password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            //assigned hashed password
            user.password = hash;
            return next();
        })
    });
});

UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {

    //check whether email or phone number exists
    const user = await UserModel.findOne({ email });

    if (!user) throw new Error("User does not exist");

    //compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
        throw new Error("Invalid Password");
    }
    return user;
};

export const UserModel = mongoose.model("Users", UserSchema);