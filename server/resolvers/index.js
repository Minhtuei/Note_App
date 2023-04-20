import { GraphQLScalarType } from "graphql";
import { folderModel, AuthorModel, NoteModel } from "../models/index.js";
export const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.toISOString();
        },
    }),
    Query: {
        folders: async (parent, children, context) => {
            //  return fakeData.folders;
            const folders = await folderModel
                .find({
                    authorId: context.uid,
                })
                .sort({
                    updatedAt: "desc",
                });
            return folders;
        },
        folder: async (parent, args) => {
            const folderId = args.folderId;
            const foundFolder = folderModel.findById(folderId);
            return foundFolder;
        },
        note: async (parent, args) => {
            const noteId = args.noteId;
            const note = await NoteModel.findById(noteId);
            return note;
            // return fakeData.notes.find((note) => note.id === noteId);
        },
    },
    Folder: {
        author: async (parent, args) => {
            const authorId = parent.authorId;
            const author = await AuthorModel.findOne({
                uid: authorId,
            });
            return author;
        },
        notes: async (parent, args) => {
            const notes = await NoteModel.find({
                folderId: parent.id,
            }).sort({
                updatedAt: "desc",
            });

            return notes;
            //return fakeData.notes.filter((note) => note.folderId === parent.id);
        },
    },
    Mutation: {
        addNote: async (parent, args, context) => {
            const newNode = new NoteModel(args);
            await newNode.save();
            return newNode;
        },
        updateNote: async (parent, args, context) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new folderModel({
                ...args,
                authorId: context.uid,
            });
            console.log({ newFolder });
            await newFolder.save();
            return newFolder;
        },
        register: async (parent, args) => {
            const foundUser = await AuthorModel.findOne({ uid: args.uid });
            if (!foundUser) {
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }
            return foundUser;
        },
    },
};
