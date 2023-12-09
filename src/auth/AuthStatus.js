import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate} from 'react-router-dom';
import { logout } from "../actions/auth";

import { MasterDataDBService } from '../services/MasterDataDBService';

import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AuthStatus() {
  const { user: currentUser } = useSelector((state) => state.auth);

  let location = useLocation();

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const masterDataDBService = new MasterDataDBService();

  const loadAllData = async () => {  
    
    setVisible(true);
    await masterDataDBService.loadAllInitData();
    setVisible(false);
  }

  const clearCacheAndReload = async () => {
    await masterDataDBService.clearCache();
    await loadAllData();
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <>
    <p>
      Welcome {currentUser.user.username}
      <button
        onClick={() => {
          dispatch(logout())
        }}
      >
        Sign out
      </button>
      <button
        onClick={async () => {
          await clearCacheAndReload();
        }}
      >
        Clear Cache
      </button>
    </p>
    <Dialog header="Loading..." visible={visible} style={{ width: '50vw' }} onHide={()=>console.log("wait...")} >
        <p className="m-0">
          Please wait while we are loading the application...
        </p>
        <ProgressSpinner />
    </Dialog>
    </>
  );
}