import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import ClientLayout from "./layouts/ClientsLayout";
import ErrorBoundary from "./ErrorBoundary";
import PlaceholderPage from "../components/shared/PlaceholderPage";
import NotFoundPage from "../components/shared/NotFoundPage";
import MarketingPage from "../features/marketing/pages/MarketingPage";
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
import AlbumPrivacyTab from "../components/album/AlbumPrivacyTab";
import AlbumClientTab from "../components/album/AlbumClientTab";
import UploadManagerPage from "../features/uploads/pages/UploadManagerPage";
import ClientsPage from "../features/clients/pages/ClientsPage";
import CreateClientPage from "../features/clients/pages/CreateClientPage";
import ClientDetailsPage from "../features/clients/pages/ClientDetailsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import SettingsLayout from "../components/settings/SettingsLayout";
import SettingsOverviewPage from "../features/settings/pages/SettingsOverviewPage";
import ProfileSettingsPage from "../features/settings/pages/ProfileSettingsPage";
import SecuritySettingsPage from "../features/settings/pages/SecuritySettingsPage";
import BrandingSettingsPage from "../features/settings/pages/BrandingSettingsPage";
import PreferencesSettingsPage from "../features/settings/pages/PreferencesSettingsPage";
import AlbumPasswordPage from "../features/client-access/pages/AlbumPasswordPage";
import ClientGalleryPage from "../features/client-access/pages/ClientGalleryPage";

const router = createBrowserRouter([
  { path: "/", element: <MarketingPage /> },
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
          { path: "privacy", element: <AlbumPrivacyTab /> },
          { path: "client", element: <AlbumClientTab /> },
        ],
      },
      { path: "/uploads", element: <UploadManagerPage /> },
      { path: "/clients", element: <ClientsPage /> },
      { path: "/clients/new", element: <CreateClientPage /> },
      { path: "/clients/:clientId", element: <ClientDetailsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <SettingsOverviewPage /> },
          { path: "profile", element: <ProfileSettingsPage /> },
          { path: "security", element: <SecuritySettingsPage /> },
          { path: "branding", element: <BrandingSettingsPage /> },
          { path: "preferences", element: <PreferencesSettingsPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    element: <ClientLayout />,
    children: [
      { path: "/a/:accessToken", element: <AlbumPasswordPage /> },
      { path: "/a/:accessToken/gallery", element: <ClientGalleryPage /> },
    ],
  },
  { path: "/index.html", element: <Navigate to="/" replace /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}