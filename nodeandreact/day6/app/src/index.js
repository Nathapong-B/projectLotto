import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Hello from './hello';
import Myinput from './pages/myinput';
// import Mybutton from './pages/mybutton';
//import Mydropdown from './pages/mydropdown';
//import Myform from './pages/myform';
import Myuseeffect from './pages/myuseeffect';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Testreducer from './pages/reducer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Hello />
  }, {
    path: "/myinput",
    element: <Myinput />
  }, {
    path: "/testreducer",
    element: <Testreducer />
  },{
    path:"/myuseeffect",
    element:<Myuseeffect />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
