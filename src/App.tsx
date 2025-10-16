
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Businesses from "./pages/Businesses";
import Profile from "./pages/Profile";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import AdminPanel from "./pages/AdminPanel";
import BusinessDetail from "./pages/BusinessDetail";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/edit-business" element={<EditBusiness />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/page/:slug" element={<ContentPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
