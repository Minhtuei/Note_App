import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { List, Card, CardContent, Typography } from "@mui/material";
import NewFolder from "./NewFolder";
import { Box } from "@mui/system";
export default function FolderList({ folders }) {
    const { folderId } = useParams();

    const [activeFolderId, setActiveFolderId] = useState(folderId);
    return (
        <List
            sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                padding: "10px",
                textAlign: "left",
                bgcolor: "#9763f6",
            }}
            subheader={
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography sx={{ fontWeight: "bold", color: "white" }}>
                        Folders
                    </Typography>
                    <NewFolder />
                </Box>
            }
        >
            {folders.map(({ id, name }) => {
                return (
                    <Link
                        key={id}
                        to={`/folders/${id}`}
                        style={{
                            textDecoration: "none",
                        }}
                        onClick={() => setActiveFolderId(id)}
                    >
                        <Card
                            sx={{
                                mb: "10px",
                                background:
                                    id === activeFolderId ? "#db6060" : null,
                            }}
                        >
                            <CardContent
                                sx={{
                                    "&:last-child": { pb: "10px" },
                                    padding: "10px",
                                }}
                            >
                                <Typography
                                    sx={{ fontSize: 16, fontWeight: "bold" }}
                                >
                                    {name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </List>
    );
}
