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
        if(user != null)
        {
            const token = generateAccessToken(user.userID, user.passwordHash, user.email);
            return res.status(200).json({email : user.email, token : token});
        }
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
        if(!token)
            return res.status(401).json({message : "Missing Authorization Token"});

        const user = await usersService.getUser(token);
        if(user != null)
            return res.status(200).json({email : user.email, userID : user.userID, first : user.firstName, last : user.lastName, regDevices : user.devices});
        else
            return res.status(401).json({message : "Authentication Failed"});
    }
    catch(error)
    {
        console.log("Authentication Error");
        next(error);
    }
}

export const removeDevice = async(req, res, next) =>
{
    try
    {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.slice(7) : null;

        if(!token)
            return res.status(401).json({message : "Missing Authorization Token"});

        const result = await usersService.removeDeviceFromUser({
            token,
            deviceID: req.body?.deviceID
        });

        if(!result.success)
        {
            if(result.error === "INVALID_DEVICE_ID")
                return res.status(400).json({message : "Invalid Device ID"});

            if(result.error === "AUTH_FAILED")
                return res.status(401).json({message : "Authentication Failed"});

            if(result.error === "DEVICE_NOT_FOUND")
                return res.status(404).json({message : "Device not registered to this user"});

            return res.status(500).json({message : "Failed to remove device"});
        }

        return res.status(200).json({
            userID: result.userID,
            deviceID: result.deviceID,
            devices: result.devices
        });
    }
    catch(error)
    {
        console.log("Remove Device Error");
        next(error);
    }
}

