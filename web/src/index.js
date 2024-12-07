import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/login';
import Home from './pages/home';
import Index from './pages';
// import Company from './pages/company';
// import Lotto from './pages/lotto';
// import Billsale from './pages/billsale';
// import Reward from './pages/reward';
// import Awardwinning from './pages/awardwinning';
// import Balancesheet from './pages/balancesheet';
// import UserManage from './pages/user_manage';
// import Banner from './pages/banner';
import Page404 from './pages/page404';
import Testapi from './pages/testapi';
import Testpagelimit from './pages/pagelimit';
import TestReceivedParams from './pages/test-received-params';
import TestSendParams from './pages/test-send-params';
import Register from './pages/register';
import TermCondition from './pages/termandcondition';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  }, {
    path: "/register",
    element: <Register />
  }, {
    path: "/login",
    element: <Login />
  }, {
    path: "/home",
    element: <Home />
  }, {
    //   path: "/company",
    //   element: <Company />
    // }, {
    //   path: "/lotto",
    //   element: <Lotto />
    // }, {
    //   path: "/billsale",
    //   element: <Billsale />
    // }, {
    //   path: "/reward",
    //   element: <Reward />
    // }, {
    //   path: "/awardwinning",
    //   element: <Awardwinning />
    // }, {
    //   path: "/balancesheet",
    //   element: <Balancesheet />
    // }, {
    //   path: "/usermanage",
    //   element: <UserManage />
    // }, {
    //   path: "/banner",
    //   element: <Banner />
    // }, {
    path: "/termandcondition",
    element: <TermCondition />
  }, {
    path: "/pagelimit",
    element: <Testpagelimit />
  }, {
    path: "/testapi",
    element: <Testapi />
  }, {
    path: "/*",
    element: <Page404 />
  }, {
    path: "/test-send-params",
    element: <TestSendParams />
  }, {
    path: "/test-received-params",
    element: <TestReceivedParams />
  }
]);

// console.log(router.state.errors)
// console.log(router)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  //<React.StrictMode>
  <RouterProvider router={router} />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
