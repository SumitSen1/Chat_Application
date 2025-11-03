import { TokenExpiredError } from "jsonwebtoken";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [6, "password must be atleast 6 characters"],
            maxlength: [12, "password must be at most 12 characters"],
        },
        profilepic: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10); 
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compare(password,this.password)
};

userSchema.methods.generateAccessToken = async function (){                 
    return jwt.sign(
        {
            _id:this._id,
            fullName: this.fullName,

        },
        process.env,ACCESS_TOKEN_SECRET ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = async function (){                 
    return jwt.sign(
        {
            _id:this._id,

        },
        process.env,REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



export const User = mongoose.model("User", userSchema)


