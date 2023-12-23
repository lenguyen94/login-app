import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { readUser, readUsers, updateUser, updatePassword, logoutUser, updateSession } from '../utils/serverHandler'

import {
    Grid, Card, CardContent, Typography, Button, CardActions,
    TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Paper,
    TextField, Container, CssBaseline,
    Dialog, DialogTitle, DialogContent, DialogActions

} from '@mui/material';
import { Stack } from "@mui/system";


import { createTheme, ThemeProvider } from '@mui/material/styles';


const defaultTheme = createTheme();

const Dashboard = (props) => {
    const { user, token } = props
    const [edit, setEdit] = useState(false)
    const [openDiaglog, setOpenDialog] = useState(false);

    const [username, setUsername] = useState("")
    const [password_1, setPassword_1] = useState("")
    const [password_2, setPassword_2] = useState("")
    const [password_3, setPassword_3] = useState("")


    var [users, setUsers] = useState([{
        id: 0,
        username: '',
        loginCount: 1,
        signUpTimestamp: 0,
        sessionTimestamp: 0
    }]);

    const navigate = useNavigate();


    useEffect(() => {
        console.log(token, user)
        if (token) {
            readUser(token).then(r => {
                if (r) { props.setUser(r) }
                else{
                    navigate('/')
                }
                setUsername(r.username)
                readUsers(token).then(r => { setUsers(r.users) })
                updateSession(token)
            })
        }
        else {
            console.log('no valid token in dashboard menu? server error?')
        }
    }, [])

    const handlePasswordChange = () => {
        if (password_2 !== password_3) {
            return window.alert("New passwords are not the same")
        }

        updatePassword(token, password_2, password_1).then(r => {
            if (r.error) { return window.alert(r.error) }
            window.alert(r.message)
            setOpenDialog(false);
        })

    };

    const handleRefresh = () => {
        // readUsers(token)
        readUsers(token).then(r => { setUsers(r.users) })
    }

    const handleUpdate = () => {
        setEdit(false)
        updateUser(token, username).then(r => {
            if (r.error) { return window.alert(r.error) }
            window.alert(r.message)
            readUser(token).then(r => {
                console.log(r)
                props.setUser(r)
                // localStorage.setItem("user", JSON.stringify(r))
            })
        })
    }

    const handleLogout = () => {
        logoutUser(token).then(r => {
            if (!r || r.error) { console.log('logout', r) }
            else {
                props.setLoggedIn(false)
                localStorage.removeItem("user", JSON.stringify(r))
                localStorage.removeItem("token", JSON.stringify(r))
                updateSession(token)
            }
            navigate("/")
        })
    }


    return <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="ms">
            <CssBaseline />

            
            <Dialog open={openDiaglog} onClose={(e) => { setOpenDialog(false) }}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password_1"
                        label="Old Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        onChange={event => { setPassword_1(event.target.value) }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password_2"
                        label="New Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        onChange={event => { setPassword_2(event.target.value) }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password_3"
                        label="Confirm Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        onChange={event => { setPassword_3(event.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePasswordChange}>Update</Button>
                </DialogActions>
            </Dialog>

            <Grid container justifyContent="space-between" alignItems="flex=start" spacing={8} >
                <Grid item xs={3} ms={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row"> {edit ?
                                [<TextField value={username} variant="standard" onChange={(e) => { setUsername(e.target.value) }}></TextField>,
                                <Button variant="text" onClick={handleUpdate}>Update</Button>,
                                <Button variant="text" onClick={(e) => { setEdit(false) }}> Cancel </Button>
                                ] :
                                [<Typography variant="h5">{username}</Typography>,
                                <Button variant="text" onClick={(e) => { setEdit(true) }}>Edit</Button>
                                ]
                            }
                            </Stack>
                            <Typography variant="body">
                                ID: {user ? user.id: 0}
                                <br></br>
                                Username: {username}
                                <br></br>
                                Email: {user?user.email:""}
                            </Typography>
                        </CardContent>
                        <CardActions >
                            <Button onClick={handleLogout} size="small">Log Out</Button>
                            <Button size="small" onClick={(e) => { setOpenDialog(true) }}>Change Password </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={12}>
                    <Typography align='center' variant="h2" >
                        User Dashboard
                    </Typography>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell align="right">Username</TableCell>
                                    <TableCell align="right">Login Count</TableCell>
                                    <TableCell align="right">Sign Up Date </TableCell>
                                    <TableCell align="right">Last Session</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">{row.username}</TableCell>
                                        <TableCell align="right">{row.loginCount}</TableCell>
                                        <TableCell align="right">{row.signUpTimestamp}</TableCell>
                                        <TableCell align="right">{row.sessionTimestamp}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5} />
                <Grid item xs={2}>
                    <Button variant="contained" onClick={handleRefresh} >Refresh Table</Button>
                </Grid>
                <Grid item xs={4} />

            </Grid>


        </Container>
    </ThemeProvider>
}

export default Dashboard