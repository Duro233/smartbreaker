import { User } from "../functions/db_schemas/user_schema.js";
import { verifyAccessToken } from "../functions/jwttoken/jwt.js";

export async function createUser({firstName, lastName, email, password})
{
    return User.create({
        firstName,
        lastName,
        email,
        userID: 111111 + (await User.getUserCount()),
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


export async function getUser(token)
{
    const getFields = verifyAccessToken(token);
    const user = await User.findOne({email: getFields.email, userID: getFields.userID, passwordHash: getFields.password}).select("+passwordHash");
    if(!user)
        return null;

    return user;
}

export async function deleteUserById(id) {
    return User.findByIdAndDelete(id);
}