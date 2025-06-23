
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/AdminSubjects";
import AdminPeople from "./pages/AdminPeople";
import AdminRequests from "./pages/AdminRequests";
import BrowseSubjects from "./pages/BrowseSubjects";
import BrowseSections from "./pages/BrowseSections";
import MyTimetable from "./pages/MyTimetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                    <Route path="/browse-subjects" element={<BrowseSubjects />} />
                    <Route path="/browse-sections" element={<BrowseSections />} />
                    <Route path="/my-timetable" element={<MyTimetable />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/subjects" element={<AdminSubjects />} />
                    <Route path="/admin/people" element={<AdminPeople />} />
                    <Route path="/admin/requests" element={<AdminRequests />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
