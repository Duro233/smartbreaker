import { User } from "../functions/db_schemas/user_schema.js";
import { verifyAccessToken } from "../functions/jwttoken/jwt.js";

// Function for handling registering new users
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

// Function for user login
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

// Function for getting user based on browser token
export async function getUser(token)
{
    try
    {
        const getFields = verifyAccessToken(token);
        const user = await User.findOne({email: getFields.email, userID: getFields.userID, passwordHash: getFields.password}).select("+passwordHash");
        if(!user)
            return null;

        return user;
    }
    catch
    {
        return null;
    }
}

export async function deleteUserById(id) {
    return User.findByIdAndDelete(id);
}


// Function for registering a new device to an account
export async function registerDeviceToAccount({email, password, deviceID})
{
    // General formatting error
    if(typeof email !== "string" || typeof password !== "string")
        return {success: false, error: "INVALID_CREDENTIALS"};

    // Invalid device ID
    if(typeof deviceID !== "string" || deviceID.trim().length === 0)
        return {success: false, error: "INVALID_DEVICE_ID"};

    // Account handler, checks if user exists and if provided credentials are valid 
    const user = await User.findOne({email}).select("+passwordHash");
    if(!user)
        return {success: false, error: "ACCOUNT_NOT_FOUND"};

    const isValid = await user.checkPassword(password);
    if(!isValid)
        return {success: false, error: "INVALID_CREDENTIALS"};


    // Initialize array for holding specific user deviceIDs
    const normalizedDeviceID = deviceID.trim();
    let devicesList = [];
    if(Array.isArray(user.devices))
        devicesList = user.devices;
    else
    {
        devicesList = Array.isArray(user.devices?.ofString) ? user.devices.ofString : [];
        user.devices = devicesList;
    }

    // Check to see if device is already linked to an account (add if not)
    const alreadyLinked = devicesList.includes(normalizedDeviceID);
    if(!alreadyLinked)
    {
        devicesList.push(normalizedDeviceID);
        user.markModified("devices");
        await user.save();
    }

    return {
        success: true,
        alreadyLinked,
        email: user.email,
        userID: user.userID,
        deviceID: normalizedDeviceID,
        devices: Array.isArray(user.devices) ? user.devices : devicesList
    };
}


// Function to verify a user owns a device by ID through DB check
export async function userOwnsDevice({userID, deviceID})
{
    if((typeof userID !== "string" && typeof userID !== "number") || typeof deviceID !== "string")
        return false;

    const normalizedDeviceID = deviceID.trim();
    if(normalizedDeviceID.length === 0)
        return false;

    const user = await User.findOne({userID: Number(userID)});
    if(!user)
        return false;

    const devices = Array.isArray(user.devices)
        ? user.devices
        : (Array.isArray(user.devices?.ofString) ? user.devices.ofString : []);

    return devices.includes(normalizedDeviceID);
}

export async function removeDeviceFromUser({token, deviceID})
{
    if(typeof deviceID !== "string" || deviceID.trim().length === 0)
        return {success: false, error: "INVALID_DEVICE_ID"};

    const user = await getUser(token);
    if(!user)
        return {success: false, error: "AUTH_FAILED"};

    const normalizedDeviceID = deviceID.trim();
    const devices = Array.isArray(user.devices)
        ? user.devices
        : (Array.isArray(user.devices?.ofString) ? user.devices.ofString : []);

    const hasDevice = devices.includes(normalizedDeviceID);
    if(!hasDevice)
        return {success: false, error: "DEVICE_NOT_FOUND"};

    user.devices = devices.filter((registeredDeviceID) => registeredDeviceID !== normalizedDeviceID);
    user.markModified("devices");
    await user.save();

    return {
        success: true,
        userID: user.userID,
        deviceID: normalizedDeviceID,
        devices: Array.isArray(user.devices) ? user.devices : []
    };
}
