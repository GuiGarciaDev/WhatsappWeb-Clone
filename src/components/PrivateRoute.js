import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function PrivateRoute({ children }) {

    const { currentUser } = useAuth()

    if (!currentUser) {
        return <Navigate to="/login" />;
      }
    
      return children;
}