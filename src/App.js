import React, { Suspense } from "react";
import { Route, Routes } from 'react-router-dom';

import 'primeflex/primeflex.css';
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; //core css
import './styles/demo/Demos.scss';
import './styles/layout/layout.scss';

import RequireAuth from "./auth/RequireAuth";
import Layout from './layout/layout';
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Fallback from "./layout/Fallback";

function App() {
  const Crud = React.lazy(() => import("./pages/Crud"));
  const DemoData = React.lazy(() => import("./pages/Demo"));
  const Form1 = React.lazy(() => import("./pages/Form1"));
  const EmpProfileList = React.lazy(() => import("./pages/emp_management/EmpProfileList"));

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />

        <Route path="/crud" element={<RequireAuth>
          <Suspense fallback={<Fallback />}>
            <Crud />
          </Suspense>
        </RequireAuth>} />
        <Route path="/demodata" element={<RequireAuth>
          <Suspense fallback={<Fallback />}>
            <DemoData />
          </Suspense>
        </RequireAuth>} />
        <Route path="/form" element={<RequireAuth>
          <Suspense fallback={<Fallback />}>
            <Form1 />
          </Suspense>
        </RequireAuth>} />
        <Route path="/emplist" element={<RequireAuth>
          <Suspense fallback={<Fallback />}>
            <EmpProfileList />
          </Suspense>
        </RequireAuth>} />
        <Route path="/empinfo/:id" element={<RequireAuth>
          <Suspense fallback={<Fallback />}>
            <Form1 />
          </Suspense>
        </RequireAuth>} />

      </Route>
    </Routes>
  );
}

export default App;
