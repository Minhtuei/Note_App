import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Avatar, Box, Typography, Menu, MenuItem } from "@mui/material";
export default function UserMenu() {
    const {
        user: { displayName, photoURL, auth },
    } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleLogout = () => {
        auth.signOut();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    return (
        <div>
            <>
                <Box sx={{ display: "flex" }} onClick={handleClick}>
                    <Typography>{displayName}</Typography>
                    <Avatar
                        alt="avatar"
                        src={photoURL}
                        sx={{ width: 24, height: 24, marginLeft: "5px" }}
                    ></Avatar>
                </Box>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </>
        </div>
    );
}
