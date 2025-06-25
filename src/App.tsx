import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Layout from "@/components/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/AdminSubjects";
import AdminPeople from "./pages/AdminPeople";
import AdminRequests from "./pages/AdminRequests";
import BrowseSubjects from "./pages/BrowseSubjects";
import BrowseSections from "./pages/BrowseSections";
import MyTimetable from "./pages/MyTimetable";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner/loader component
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner/loader component
  }

  // This assumes ProtectedRoute has already checked for user existence
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const HomeRedirect = () => {
  const { user } = useUser();
  // This component should be used inside a ProtectedRoute
  return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/browse-subjects" element={<BrowseSubjects />} />
                <Route path="/browse-sections" element={<BrowseSections />} />
                <Route path="/my-timetable" element={<MyTimetable />} />

                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/subjects" element={<AdminSubjects />} />
                  <Route path="/admin/people" element={<AdminPeople />} />
                  <Route path="/admin/requests" element={<AdminRequests />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
