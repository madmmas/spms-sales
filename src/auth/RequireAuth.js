import { useLocation, useNavigate} from 'react-router-dom';
import { useSelector } from "react-redux";

export default function RequireAuth({ children }) {
    const { user: currentUser } = useSelector((state) => state.auth);
    let location = useLocation();

    let navigate = useNavigate();

    if (!currentUser) {
      // return <Navigate to="/login" state={{ from: location }} replace />;
      navigate("/login", { state: { from: location } });
    }
  
    return children;
}