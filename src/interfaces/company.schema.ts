import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
    {
        email: { type: String, unique: true },
        name: { type: String, unique: true },
        description: { type: String },
        employees: { type: Array },
    },
    { timestamps: true, collection: 'companies' },
);
