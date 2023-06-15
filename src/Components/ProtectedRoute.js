import { Navigate } from "react-router-dom";
import { useUserAuth } from "../UserAuthContext";

const ProtectedRoute = ({children}) => {

    const {user} = useUserAuth();
    console.log(user);
    if (!user) {
        return <Navigate to="/" />
    }
    return children;
};

export default ProtectedRoute;