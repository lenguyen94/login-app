import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { readUser} from "../utils/serverHandler";

const Redirect = (props) => {
  const navigate = useNavigate();

  useEffect(() => {

    readUser().then(r => {
      if ( (!r) || r.error) {
        props.setLoggedIn(false)
        navigate('/home')
      }
      else {
        props.setLoggedIn(true)
        props.setUser(r)
        navigate('/dashboard')
      }
    })

  }, [])

}

export default Redirect;
