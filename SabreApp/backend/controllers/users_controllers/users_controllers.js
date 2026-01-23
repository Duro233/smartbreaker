import * as usersService from "../../services/users_services.js";
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
        return res.status(201).json({id: user._id, email: user.email});
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
            return res.status(201).json({email : user.email});
        else
            return res.status(404).json({message : "Invalid Credentials"});
    }
    catch (error) 
    {
        console.log("Login Error");
        next(error);
    }
}

