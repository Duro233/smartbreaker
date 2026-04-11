import { Logs } from "../functions/db_schemas/data_schema.js";

export async function logData({timestamp, deviceID, current, temperature, active})
{
    if(typeof deviceID !== "string" || deviceID.trim().length === 0)
        return {success: false, error: "INVALID_DEVICE_ID"};

    if(typeof current !== "number" || !Number.isFinite(current))
        return {success: false, error: "INVALID_CURRENT"};

    if(typeof temperature !== "number" || !Number.isFinite(temperature))
        return {success: false, error: "INVALID_TEMPERATURE"};

    const resolvedTimestamp = timestamp == null ? new Date() : new Date(timestamp);
    if(Number.isNaN(resolvedTimestamp.getTime()))
        return {success: false, error: "INVALID_TIMESTAMP"};

    const log = await Logs.create({
        timestamp: resolvedTimestamp,
        deviceID: deviceID.trim(),
        current,
        temperature,
        active: active
    });

    return {
        success: true,
        log
    };
}

export async function getLogs({deviceID, startDate, endDate, limit})
{
    const query = {};

    if(typeof deviceID === "string" && deviceID.trim().length > 0)
        query.deviceID = deviceID.trim();

    if(startDate != null || endDate != null)
    {
        query.timestamp = {};

        if(startDate != null)
        {
            const parsedStartDate = new Date(startDate);
            if(Number.isNaN(parsedStartDate.getTime()))
                return {success: false, error: "INVALID_START_DATE"};

            query.timestamp.$gte = parsedStartDate;
        }

        if(endDate != null)
        {
            const parsedEndDate = new Date(endDate);
            if(Number.isNaN(parsedEndDate.getTime()))
                return {success: false, error: "INVALID_END_DATE"};

            query.timestamp.$lte = parsedEndDate;
        }
    }

    const parsedLimit = Number(limit);
    const resolvedLimit = Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 1000)
        : 1000;

    const logs = await Logs.find(query)
        .sort({timestamp: -1})
        .limit(resolvedLimit)
        .lean();

    return {
        success: true,
        logs
    };
}
