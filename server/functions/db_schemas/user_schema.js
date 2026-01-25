import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mongoose_user_db = mongoose.connection.useDb('smartbreaker');

const userSchema = new mongoose.Schema(
{
    firstName:
    {
        type: String,
        required: true,
        trim: true
    },

    lastName:
    {
        type: String,
        required: true,
        trim: true
    },

    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    passwordHash:
    {
        type: String,
        required: true,
        select: false
    },

    userID:
    {
        type: Number,
        required: true,
        trim: true
    },

    devices:
    {
        ofString: [String]
    }
    }
);


userSchema.methods.checkPassword = async function(password)
{
    return bcrypt.compare(password, this.passwordHash);
}

userSchema.pre("save", async function()
{
    if(!this.isModified("passwordHash")) return;
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.statics.getUserCount = async function()
{
    return this.countDocuments();
}

//userSchema.index({email : 1}, {unique:true});

export const User = mongoose_user_db.model("users", userSchema);