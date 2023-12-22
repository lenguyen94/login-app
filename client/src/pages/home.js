import React from "react"
import { useNavigate } from "react-router-dom";

import {
    Button, CssBaseline, Box, Typography, Container
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';


const defaultTheme = createTheme();


const Home = () => {
    const navigate = useNavigate();

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
                    <Typography component="h1" variant="h2">
                        Home Page
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 5, mb: 2 }}
                        onClick={() => { navigate("/signin") }}
                    >
                        Sign In
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 5, mb: 2 }}
                        onClick={() => { navigate("/signup") }}
                    >
                        Sign up
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 5, mb: 2 }}
                        onClick={() => { window.open(`${global.config.apiServer}/login-google`, "_self") }}
                    >
                        Sign In with Google
                    </Button>

                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Home