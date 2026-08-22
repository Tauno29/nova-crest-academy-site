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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admissions" component={AdmissionsPage} />
      <Route path="/hostel" component={HostelPage} />
      <Route path="/gallery"><InnerPage type="gallery" /></Route>
      <Route path="/fees"><InnerPage type="fees" /></Route>
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
