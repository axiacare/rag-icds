import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Reports from "./pages/Auditor";
import AuditExecution from "./pages/AuditExecution";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={
              <PageTransition>
                <Auth />
              </PageTransition>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <PageTransition>
                  <Index />
                </PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <PageTransition>
                  <Admin />
                </PageTransition>
              </AdminRoute>
            } />
            <Route path="/auditor" element={
              <ProtectedRoute>
                <PageTransition>
                  <Reports />
                </PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/auditor/execute/:auditId" element={
              <ProtectedRoute>
                <PageTransition>
                  <AuditExecution />
                </PageTransition>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
