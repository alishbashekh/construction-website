import mongoose from 'mongoose';

const apiLogsSchema = new mongoose.Schema(
    {
        ip: { type: String, required: true },  
        deviceType: { type: String, required: true }, 
        userAgent: { type: String, required: true }, 
        method: { type: String, required: true },  
        headers: { type: Object, required: true }, 
        body: { type: Object, required: false },
        cookies: { type: Object, required: false }, 
        endpoint: { type: String, required: true },
        statusCode: { type: Number, required: true },  
        timestamp: { type: Date, default: Date.now }, 
    },
    { timestamps: true }
);

const ApiLogs = mongoose.model('ApiLogs', apiLogsSchema);

export default ApiLogs;
