import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mongoose_user_db = mongoose.connection.useDb('Users');

const userSchema = new mongoose.Schema(
{
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

userSchema.index({email : 1}, {unique:true});

export const User = mongoose_user_db.model("User", userSchema);