import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from 'react';
import { readUser } from "../utils/serverHandler";
import { Typography } from "@mui/material";

const Redirect = (props) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get("token"))
    console.log(searchParams.get("a"))
    var token = searchParams.get("token")

    if (token) { //redirecting from google login
      console.log(1)
      localStorage.setItem("token", token)
      props.setToken(token)
    }

    if (!token) {
      token = localStorage.getItem("token")
    }
    if (token) {
      readUser(token).then(r => {
        console.log(1, r)
        if ((!r) || r.error) {
          // clear bad storage data

          console.log(1, r)
          localStorage.clear()
          props.setLoggedIn(false)
          props.setToken(null)
          navigate('/home')
        }
        else {
          console.log(2, r)
          props.setLoggedIn(true)
          props.setUser(r)
          navigate('/dashboard')
        }
      })
    } else {
      navigate('/home')
    }

  }, [])
  return 'redirect page'

}

export default Redirect;
