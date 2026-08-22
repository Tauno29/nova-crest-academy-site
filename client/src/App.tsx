/* Nova Crest clone style: reference-driven school branding with cream surfaces, navy type, coral/lilac accents, and generous editorial spacing. */
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import InnerPage from "./pages/InnerPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import HostelPage from "./pages/HostelPage";
import GalleryPage from "./pages/GalleryPage";
import FeesPage from "./pages/FeesPage";
import ParentPortalPage from "./pages/ParentPortalPage";
import AdminPortalPage from "./pages/AdminPortalPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admissions" component={AdmissionsPage} />
      <Route path="/hostel" component={HostelPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/fees" component={FeesPage} />
      <Route path="/parent-portal" component={ParentPortalPage} />
      <Route path="/admin" component={AdminPortalPage} />
      <Route path="/admin/content" component={AdminPortalPage} />
      <Route path="/admin/learners" component={AdminPortalPage} />
      <Route path="/admin/parents" component={AdminPortalPage} />
      <Route path="/admin/marks" component={AdminPortalPage} />
      <Route path="/admin/updates" component={AdminPortalPage} />
      <Route path="/admin/documents" component={AdminPortalPage} />
      <Route component={Home} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
