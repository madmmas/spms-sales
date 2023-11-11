import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { LayoutProvider } from './layout/context/layoutcontext';
import moment from 'moment-timezone';
import App from './App';
import store from './store'

import db from "./db";
import RProductService from "./services/RProductService";
import CacheMasterDataService from "./services/CacheMasterDataService";

moment.tz.setDefault("Asia/Dhaka");
const root = ReactDOM.createRoot(document.getElementById('root'));

const loadAllData = async () => {
  const newDiv = document.getElementById('root');
  const newContent = document.createTextNode("Please wait while we are loading the application...");
  newDiv.appendChild(newContent);

  // db.initDB();
  // load the product data here
  let products = window['__all_products'];
  
  // if products undefined or empty load all from server limit 1000 until no more
  if (!products || products.length == 0) {
    RProductService.loadAllProductsFromLocalStorage();
  }

  let masterData = window['__all_masterData'];

  // if masterData undefined or empty load all from server limit 1000 until no more
  if (masterData === undefined || masterData.length == 0) {
    console.log("masterData is undefined or empty");
    CacheMasterDataService.checkAndLoadAllMasterData();
  }
}

const waitThenRun = async () => {
  await loadAllData();
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
}

waitThenRun();
