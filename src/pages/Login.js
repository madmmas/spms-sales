import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';

import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { MasterDataDBService } from '../services/MasterDataDBService';

import { login } from "../actions/auth";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', 'p-input-filled');

    let navigate = useNavigate();
    let location = useLocation();
    const dispatch = useDispatch();
  
    let from = location.state?.from?.pathname || "/";

  const handleLogin = (event) => {
    event.preventDefault()
    if (username === '' || password === '') {
        setError('* Username and password are required');
        return;
    }
    dispatch(login(username, password))
        .then(async () => {
            setError('');
            await loadAllData();
            navigate(from);
        })
        .catch(() => {
            setError('* Invalid username or password');
        });
    }

    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');

  const loadAllData = async () => {  
    const masterDataDBService = new MasterDataDBService();
    
    setVisible(true);
    let response = await masterDataDBService.sessionPing();
    console.log("Appjs-sessionPing::", response);
    if (response===true) {
      await masterDataDBService.loadAllInitData();
    }
    setVisible(false);
  }

  return (
    <>
    <Dialog header="Loading..." visible={visible} style={{ width: '50vw' }} onHide={()=>console.log("wait...")} >
        <p className="m-0">
        Please wait while we are loading the application...
        </p>
        <ProgressSpinner />
    </Dialog>
      <div className={containerClassName}>
          <div className="flex flex-column align-items-center justify-content-center">
              <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                  <form className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                      <div className="text-center mb-5">
                          <img src={`/demo/images/login/avatar.png`} alt="Image" height="50" className="mb-3" />
                          <div className="text-900 text-3xl font-medium mb-3">Welcome to SPMS-APP!</div>
                          <span className="text-600 font-medium">Sign in to continue</span>
                      </div>

                      <div>
                          <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                              Username
                          </label>
                          <InputText inputid="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                          <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                              Password
                          </label>
                          <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>
                          <div class="p-error" id="error_msg">{error}</div>

                          <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                          <Button label="Sign In" className="w-full p-3 text-xl" onClick={(e) => handleLogin(e)}></Button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </>
  );
};

  LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};
export default LoginPage;