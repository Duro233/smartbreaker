import * as usersService from "../../services/users_services.js";
import { generateAccessToken } from "../../functions/jwttoken/jwt.js";





export const deleteUser = (req, res, next) =>
{
    console.log("user deleted endpoint hit");
    res.status(200).json("user deleted endpoint hig");
}; 




export const createUser = async (req, res, next) =>
{
    console.log('Create User Endpoint HIt');
    try
    {
        const user = await usersService.createUser(req.body);
        return res.status(201).json({id: user.userID, email: user.email});
    }
    catch (err)
    {
        next(err);
    }

    
    res.status(200).json("we love the lumby tribe");
}





export const loginUser = async(req, res, next) =>
{
    console.log('Login Endpoint Hit');
    try 
    {
        const user = await usersService.loginUser(req.body);
        const token = generateAccessToken(user.userID, user.passwordHash, user.email);
        if(user != null)
            return res.status(200).json({email : user.email, token : token});
        else
            return res.status(404).json({message : "Invalid Credentials"});
    }
    catch (error) 
    {
        console.log("Login Error");
        next(error);
    }
}

export const getUser = async(req, res, next) =>
{
    try
    {
        const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7) : null;
        const user = await usersService.getUser(token);
        if(user != null)
            return res.status(200).json({email : user.email, userID : user.userID, first : user.firstName, last : user.lastName, regDevices : user.devices});
        else
            return res.status(404).json({message : "Authentication Failed"});
    }
    catch(error)
    {
        console.log("Authentication Error");
        next(error);
    }
}

