import { useLocation, Navigate} from 'react-router-dom';
import { useSelector } from "react-redux";

export default function RequireAuth({ children }) {
    const { user: currentUser } = useSelector((state) => state.auth);
    let location = useLocation();
  
    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
}