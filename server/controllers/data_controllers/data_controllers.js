import * as dataService from "../../services/data_services.js";

export const logData = async (req, res, next) =>
{
    console.log("Data Logging Endpoint Hit");

    try
    {
        const result = await dataService.logData(req.body);

        if(!result.success)
            return res.status(400).json({message: result.error});

        return res.status(201).json({
            message: "Log created successfully",
            log: result.log
        });
    }
    catch(error)
    {
        console.log("Data Logging Error");
        next(error);
    }
};

export const getLogs = async (req, res, next) =>
{
    console.log("Data Fetch Endpoint Hit");

    try
    {
        const result = await dataService.getLogs(req.query);

        if(!result.success)
            return res.status(400).json({message: result.error});

        return res.status(200).json({
            logs: result.logs
        });
    }
    catch(error)
    {
        console.log("Data Fetch Error");
        next(error);
    }
};
