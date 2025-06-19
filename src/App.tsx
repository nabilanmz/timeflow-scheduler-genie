
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Layout from "@/components/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BrowseSubjects from "./pages/BrowseSubjects";
import BrowseSections from "./pages/BrowseSections";
import MyTimetable from "./pages/MyTimetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/browse-subjects" element={<BrowseSubjects />} />
              <Route path="/browse-sections" element={<BrowseSections />} />
              <Route path="/my-timetable" element={<MyTimetable />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/classes" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
