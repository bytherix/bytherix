import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    desc: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true,
    },

    desc: {
        type: String,
        required: true,
        maxlength: 2000,
    },
}, { timestamps: true });


export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);