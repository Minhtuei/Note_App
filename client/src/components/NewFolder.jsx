import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    IconButton,
    Tooltip,
} from "@mui/material";
import { DialogContent, DialogTitle, TextField } from "@mui/material";
import { CreateNewFolderOutlined } from "@mui/icons-material";
import { addNewFolder } from "../utils/folderLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function NewFolder() {
    const [newFolderName, setNewFolderName] = useState("");
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const popUpName = searchParams.get("popup");
    const navigate = useNavigate();
    const handleNewFolderNameChange = (e) => {
        setNewFolderName(e.target.value);
    };
    const handleClose = () => {
        setNewFolderName("");
        navigate(-1);
    };
    const handleNewFolder = async () => {
        const { addFolder } = await addNewFolder({
            name: newFolderName,
        });
        console.log({ addFolder });
        handleClose();
    };

    const handleOpenPopUp = () => {
        //setOpen(true);
        setSearchParams({ popup: "add-folder" });
    };
    useEffect(() => {
        if (popUpName === "add-folder") {
            setOpen(true);
            return;
        }
        setOpen(false);
    }, [popUpName]);
    return (
        <div>
            <Tooltip title="Add Folder" onClick={handleOpenPopUp}>
                <IconButton size="small">
                    <CreateNewFolderOutlined
                        sx={{ color: "white" }}
                    ></CreateNewFolderOutlined>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Folder Name"
                        fullWidth
                        size="small"
                        variant="standard"
                        sx={{ width: "400px" }}
                        autoComplete="off"
                        value={newFolderName}
                        onChange={handleNewFolderNameChange}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleNewFolder}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
