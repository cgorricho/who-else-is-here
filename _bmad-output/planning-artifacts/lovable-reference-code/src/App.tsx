import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OAuth from "./pages/OAuth";
import OAuthError from "./pages/OAuthError";
import OAuthDenied from "./pages/OAuthDenied";
import Loading from "./pages/Loading";
import FullAttendeeList from "./pages/FullAttendeeList";
import Offline from "./pages/Offline";
import NotStarted from "./pages/NotStarted";
import Admin from "./pages/Admin";
import AdminSessions from "./pages/AdminSessions";
import PostEvent from "./pages/PostEvent";
import Archived from "./pages/Archived";
import EventAggregate from "./pages/EventAggregate";
import SearchFilter from "./pages/SearchFilter";
import Lobby from "./pages/Lobby";
import AdminCreate from "./pages/AdminCreate";
import QRPreview from "./pages/QRPreview";
import AdminReport from "./pages/AdminReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/oauth" element={<OAuth />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/full-attendee-list" element={<FullAttendeeList />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/not-started" element={<NotStarted />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
          <Route path="/admin/create" element={<AdminCreate />} />
          <Route path="/admin/qr-preview" element={<QRPreview />} />
          <Route path="/admin/report" element={<AdminReport />} />
          <Route path="/post-event" element={<PostEvent />} />
          <Route path="/error" element={<OAuthError />} />
          <Route path="/archived" element={<Archived />} />
          <Route path="/event-aggregate" element={<EventAggregate />} />
          <Route path="/search" element={<SearchFilter />} />
          <Route path="/denied" element={<OAuthDenied />} />
          <Route path="/lobby" element={<Lobby />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
