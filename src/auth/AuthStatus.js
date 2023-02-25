import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate} from 'react-router-dom';
import { logout } from "../actions/auth";

export default function AuthStatus() {
  const { user: currentUser } = useSelector((state) => state.auth);
  let location = useLocation();

  const dispatch = useDispatch();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <p>
      Welcome {currentUser.user.username}
      <button
        onClick={() => {
          dispatch(logout())
        }}
      >
        Sign out
      </button>
    </p>
  );
}