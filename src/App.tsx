import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "react-oidc-context";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import BlockedFiles from "./pages/BlockedFiles";
import NotFound from "./pages/NotFound";
import AuthCallbackHandler from './components/AuthCallbackHandler'; // או הנתיב המתאים

const queryClient = new QueryClient();

const authConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_uj0x1RCWC",
  client_id: "7nq6vuoqq12tjbv9sson7lceb3",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid email phone",
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider {...authConfig}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthCallbackHandler />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/logs" replace />} />
            <Route element={<Layout />}>
              <Route path="/logs" element={<Logs />} />
              <Route path="/blocked-files" element={<BlockedFiles />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
