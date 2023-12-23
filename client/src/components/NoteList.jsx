import React, { useEffect } from "react";
import {
    Grid,
    List,
    Card,
    CardContent,
    Typography,
    Tooltip,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Outlet, useSubmit } from "react-router-dom";
import { Box } from "@mui/system";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NoteAddOutlined } from "@mui/icons-material";
import moment from "moment";
export default function NodeList() {
    //const folders = { note: [{ id: "1", content: "Hello World" }] };
    const { noteId, folderId } = useParams();
    const [activeNoteId, setActiveNoteId] = useState(noteId);
    const { folder } = useLoaderData();
    const SubmitEvent = useSubmit();
    const navigate = useNavigate();
    console.log(folder);
    useEffect(() => {
        if (noteId) {
            setActiveNoteId(noteId);
            return;
        }
        if (folder?.notes?.[0]) {
            navigate(`note/${folder.notes[0].id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId, folder.notes]);
    const handleAddNewNote = () => {
        SubmitEvent(
            {
                content: "",
                folderId: folderId,
            },
            {
                method: "POST",
                action: `/folders/${folderId}`,
            }
        );
    };
    return (
        <Grid container sx={{ height: "100%", overflow: "auto" }}>
            <Grid
                item
                xs={4}
                sx={{
                    width: "100%",
                    maxWidth: "360px",
                    bgcolor: "#f5d26f",
                    height: "100%",
                    overflowY: "auto",
                    padding: "10px",
                    textAlign: "left",
                }}
            >
                <List
                    subheader={
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography style={{ fontWeight: "bold" }}>
                                Notes
                            </Typography>
                            <Tooltip
                                title="Add Note"
                                onClick={handleAddNewNote}
                            >
                                <IconButton size="small">
                                    <NoteAddOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    }
                >
                    {folder.notes.map(({ id, content, updatedAt }) => {
                        return (
                            <Link
                                key={id}
                                to={`note/${id}`}
                                style={{ textDecoration: "none" }}
                                onClick={() => setActiveNoteId(id)}
                            >
                                <Card
                                    sx={{
                                        mb: "5px",
                                        backgroundColor:
                                            id === activeNoteId
                                                ? "#db6060"
                                                : null,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            "&:last-child": { pb: "10px" },
                                            padding: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "bold",
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: `${
                                                    content.substring(0, 30) ||
                                                    "Empty"
                                                }`,
                                            }}
                                        />
                                        <Typography sx={{ fontSize: "10px" }}>
                                            {moment(updatedAt).format(
                                                "MMMM Do YYYY, h:mm:ss a"
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </List>
            </Grid>
            <Grid item xs={8}>
                <Outlet />
            </Grid>
        </Grid>
    );
}
