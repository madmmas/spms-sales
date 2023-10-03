import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { LayoutProvider } from './layout/context/layoutcontext';
import moment from 'moment-timezone';
import App from './App';
import store from './store'

moment.tz.setDefault("Asia/Dhaka");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <HashRouter>
        <LayoutProvider>
            <App />
        </LayoutProvider>
      </HashRouter>
      {/* </BrowserRouter> */}
    </Provider>
  </React.StrictMode>
);