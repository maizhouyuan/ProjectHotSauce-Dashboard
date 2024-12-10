import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SensorsPage from "./pages/SensorsPage";
import ReportsPage from "./pages/ReportsPage";
import LoginPage from "./pages/LoginPage";
import LoginPage from "./pages/LogoutPage";
import LoginPage from "./pages/SettingsPage";
import Layout from "./components/Layout";

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
  {
    path: "/logout",
    element: (
        <LogoutPage />
    ),
  },
  {
    path: "/settings",
    element: (
        <SettingsPage />
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
