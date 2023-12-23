import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } //createdAt, updatedAt
);
const folderModel = mongoose.model("Folder", folderSchema);
export default folderModel;
