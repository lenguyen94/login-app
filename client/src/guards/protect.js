import { Navigate } from "react-router-dom";



const Protect = ({ loggedIn, children }) => {

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default Protect;