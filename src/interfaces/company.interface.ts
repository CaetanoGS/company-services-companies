import { Document } from 'mongoose';

export interface CompanyInterface extends Document {
    readonly email: string;
    readonly name: string;
    readonly description: string;
    readonly employees: Array<string>;
}
