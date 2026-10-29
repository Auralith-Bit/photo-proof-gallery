import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import PlaceholderPage from "../components/shared/PlaceholderPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AlbumsPage from "../features/albums/pages/AlbumsPage";
import CreateAlbumPage from "../features/albums/pages/CreateAlbumPage";
import AlbumWorkspaceLayout from "./layouts/AlbumWorkspaceLayout";
import AlbumPhotosPage from "../features/albums/pages/AlbumPhotosPage";
import AlbumDetailsTab from "../components/album/AlbumDetailsTab";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: <WorkspaceLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/albums", element: <AlbumsPage /> },
      { path: "/albums/new", element: <CreateAlbumPage /> },
      {
        path: "/albums/:albumId",
        element: <AlbumWorkspaceLayout />,
        children: [
          { index: true, element: <AlbumPhotosPage /> },
          { path: "details", element: <AlbumDetailsTab /> },
          { path: "privacy", element: <PlaceholderPage title="Privacy" /> },
          { path: "client", element: <PlaceholderPage title="Client" /> },
        ],
      },
      { path: "/uploads", element: <PlaceholderPage title="Uploads" /> },
      { path: "/clients", element: <PlaceholderPage title="Clients" /> },
      { path: "/analytics", element: <PlaceholderPage title="Analytics" /> },
      { path: "/settings", element: <PlaceholderPage title="Settings" /> },
      { path: "/settings/profile", element: <PlaceholderPage title="Profile" /> },
      { path: "/settings/security", element: <PlaceholderPage title="Security" /> },
      { path: "/settings/branding", element: <PlaceholderPage title="Studio Branding" /> },
      { path: "/settings/preferences", element: <PlaceholderPage title="Preferences" /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/a/:accessToken", element: <PlaceholderPage title="Client Album Access" /> },
  { path: "/a/:accessToken/gallery", element: <PlaceholderPage title="Client Gallery" /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}