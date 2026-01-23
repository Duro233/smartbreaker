import { User } from "../functions/db_schemas/user_schema.js";

export async function createUser({email, password})
{
    return User.create({
        email,
        passwordHash: password
    });
}




export async function loginUser({email, password})
{
    const user = await User.findOne({email}).select("+passwordHash");
    if(!user)
    {
        return null;
    }
    const isValid = await user.checkPassword(password);
    if(!isValid)
    {
        return null;
    }
    return user;
}






export async function getUserById(id){
    return User.findById(id).lean();
}

export async function deleteUserById(id) {
    return User.findByIdAndDelete(id);
}