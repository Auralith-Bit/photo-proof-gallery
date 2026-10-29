import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import PlaceholderPage from "../components/shared/PlaceholderPage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: <WorkspaceLayout />,
    children: [
      { path: "/dashboard", element: <PlaceholderPage title="Dashboard" /> },
      { path: "/albums", element: <PlaceholderPage title="My Albums" /> },
      { path: "/albums/new", element: <PlaceholderPage title="Create Album" /> },
      { path: "/albums/:albumId", element: <PlaceholderPage title="Album Workspace" /> },
      { path: "/albums/:albumId/details", element: <PlaceholderPage title="Album Details" /> },
      { path: "/albums/:albumId/privacy", element: <PlaceholderPage title="Privacy" /> },
      { path: "/albums/:albumId/client", element: <PlaceholderPage title="Client" /> },
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
  { path: "/login", element: <PlaceholderPage title="Sign In" /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}