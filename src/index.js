import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { LayoutProvider } from './layout/context/layoutcontext';
import App from './App';
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LayoutProvider>
            <App />
        </LayoutProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);