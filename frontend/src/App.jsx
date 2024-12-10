import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SensorsPage from "./pages/SensorsPage";
import ReportsPage from "./pages/ReportsPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <LoginPage />
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout title="Dashboard">
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: "/sensors",
    element: (
      <Layout title="Sensors">
        <SensorsPage />
      </Layout>
    ),
  },
  {
    path: "/reports",
    element: (
      <Layout title="Reports">
        <ReportsPage />
      </Layout>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
