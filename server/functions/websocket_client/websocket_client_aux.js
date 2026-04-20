export function messageParser(parsedPayload)
{
     let commaSeparatedValues = [];

    if(typeof parsedPayload === "string")
    {
        commaSeparatedValues = parsedPayload
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
    }
    else if(parsedPayload && typeof parsedPayload === "object")
    {
        commaSeparatedValues = Object.values(parsedPayload)
            .filter((value) => typeof value === "string")
            .flatMap((value) => value.split(","))
            .map((value) => value.trim())
            .filter(Boolean);
    }

    if(typeof commaSeparatedValues[0] === "string" && commaSeparatedValues[0].includes("ID Connect"))
    {
        console.log(commaSeparatedValues[0]);
    }

    return commaSeparatedValues;
}

export function getIdConnectPayload(commaSeparatedValues)
{
    if(!Array.isArray(commaSeparatedValues) || commaSeparatedValues.length < 4)
    {
        return null;
    }

    const command = commaSeparatedValues[0];
    if(typeof command !== "string" || !command.includes("register_device"))
    {
        return null;
    }

    const email = commaSeparatedValues[1]?.trim();
    const password = commaSeparatedValues[2]?.trim();
    const deviceID = commaSeparatedValues[3]?.trim();

    if(!email || !password || !deviceID)
    {
        return null;
    }

    return {email, password, deviceID};
}
