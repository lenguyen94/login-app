import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar, Button, CssBaseline, TextField, FormControlLabel,
  Checkbox, Link, Grid, Box, Typography, Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { loginUser, resendEmail } from "../utils/serverHandler";


const defaultTheme = createTheme();

export default function SignIn(props) {
  const [, setRemember] = useState(true)

  const [email, setEmail] = useState("")


  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    // _logIn();
    loginUser(data.get('email'), data.get('password')).then(r => {
      if (r.error) {
        console.log(r.error)
        window.alert(r.error)
        if (r.error.includes("verified")) {
          console.log(1)
          setEmail(data.get('email'));
        } else {
          setEmail("")
        }
      }
      else {
        var user = JSON.stringify(r)
        if (user) {
          props.setLoggedIn(true)
          props.setUser(r)
          // if (remember) { localStorage.setItem("user", JSON.stringify(r)) }
          navigate("/dashboard")
        }
      }
    })

  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox disabled={true} value="remember" color="primary" onChange={(e) => {setRemember(e.target.checked)}} />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {(email !== "") ? <Link onClick={() => {resendEmail(email) }} variant="body2">Resend Email</Link> : null}
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}