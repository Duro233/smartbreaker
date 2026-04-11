import mongoose from "mongoose"

const mongoose_logs_db = mongoose.connection.useDb('smartbreaker');

const logsSchema = new mongoose.Schema(
    {
        timestamp:
        {
            type: Date,
            required: true,
            default: Date.now,
            index: true
        },

        deviceID:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        current:
        {
            type: Number,
            required: true
        },

        temperature:
        {
            type: Number,
            required: true
        },

        active:
        {
            type: Boolean,
            required: true
        }
    },
    {
        collection: "persistent-logs",
        timeseries:
        {
            timeField: "timestamp",
            metaField: "deviceID",
            granularity: "minutes"
        }
    }
);

export const Logs = mongoose_logs_db.model("persistent-logs", logsSchema);
