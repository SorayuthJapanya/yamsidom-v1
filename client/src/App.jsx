import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// context
import ProtectedRoute from "./context/AdminProtect";

// Layouts
import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import AdminLayout from "./layouts/AdminLayout";

// Main Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import AdminHomePage from "./pages/Admin/AdminHomePage";
import ManageSpeciesPage from "./pages/Admin/ManageSpeciesPage";
import ManageAdmin from "./pages/Admin/ManageAdminPage";
import HistoryAdminPage from "./pages/Admin/HistoryAdminPage";
import ViewProfileUserPage from "./pages/Admin/ViewProfileUserPage";
import EditUserPage from "./pages/Admin/EditUserPage";
import ManageGalleryPage from "./pages/Admin/ManageGalleryPage";

// Auth Pages
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/auth/ProfilePage";
import EditProfilePage from "./pages/auth/EditProfilePage";

// Classification Pages
import ClassificationPage from "./pages/Classification/ClassificationPage";
import EditPreviewPage from "./pages/Classification/EditPreviewPage";
import HistoryPage from "./pages/HistoryPage";

// Species Pages
import SpeciesPage from "./pages/Spicies/SpeciesPage";
import AddSpeciePage from "./pages/Spicies/AddSpeciePage";
import EditSpeciesPage from "./pages/Spicies/EditSpeciesPage";

// Report Page
import PreviewReportPage from "./pages/report/PreviewReportPage";
import { Loader2 } from "lucide-react";
import { useAuthUser } from "./api/AuthApi";
import ImageGalleryPage from "./pages/ImageGalleryPage";
import AddUserPage from "./pages/Admin/AddUserPage";
import ManageImagePage from "./pages/Admin/ManageImagePage";

const App = () => {
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <Loader2 className="size-5 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-gray-50 flex flex-col relation">
        <Routes>
          {/* Main Layouts */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Classification */}
            <Route
              path="/classification"
              element={
                authUser ? <ClassificationPage /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path="/history"
              element={authUser ? <HistoryPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/preview"
              element={
                authUser ? <EditPreviewPage /> : <Navigate to={"/login"} />
              }
            />

            {/* Species */}
            <Route
              path="/species"
              element={authUser ? <SpeciesPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/species/:id"
              element={
                authUser ? <ImageGalleryPage /> : <Navigate to={"/login"} />
              }
            />

            {/* Authen */}
            <Route
              path="/login"
              element={authUser ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/profile/:id"
              element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/edit-profile/:id"
              element={
                authUser ? <EditProfilePage /> : <Navigate to={"/login"} />
              }
            />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <AdminHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-user"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <ManageAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-user"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <AddUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-user/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-species"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <ManageSpeciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <HistoryAdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile-user/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <ViewProfileUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-species"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <AddSpeciePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-species/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <EditSpeciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-gallery"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <ManageGalleryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-gallery/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                  <ManageImagePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Blank layout */}
          <Route element={<BlankLayout />}>
            {/* Report route */}
            <Route path="/preview-report" element={<PreviewReportPage />} />
          </Route>

          {/* NotFoundPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
