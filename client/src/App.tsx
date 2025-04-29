import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { SiteLayout } from "@/components/layout/site-layout";
import { ReactNode } from "react";

// Páginas
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import NewsIndex from "@/pages/news/index";
import NewsArticle from "@/pages/news/article";
import Application from "@/pages/application";
import LoginPage from "@/pages/login";
import TermsOfService from "@/pages/terms";
import PrivacyPolicy from "@/pages/privacy";
import TeamPage from "@/pages/team";

// Páginas Admin
import AdminDashboard from "@/pages/admin/dashboard";
import AdminNewsIndex from "@/pages/admin/news/index";
import AdminNewsEditor from "@/pages/admin/news/editor";
import AdminApplicationsIndex from "@/pages/admin/applications/index";
import AdminApplicationView from "@/pages/admin/applications/view";
import AdminSettings from "@/pages/admin/settings";

// Componente wrapper para aplicar o layout
const LayoutRoute = ({ 
  component: Component, 
  withLayout = true
}: { 
  component: React.ComponentType<any>,
  withLayout?: boolean 
}) => {
  return withLayout ? (
    <SiteLayout>
      <Component />
    </SiteLayout>
  ) : (
    <Component />
  );
};

// Componente wrapper para rotas protegidas com layout
const ProtectedLayoutRoute = ({
  path,
  component: Component,
  withLayout = true
}: {
  path: string,
  component: React.ComponentType<any>,
  withLayout?: boolean
}) => {
  const WrappedComponent = () => (
    withLayout ? (
      <SiteLayout>
        <Component />
      </SiteLayout>
    ) : (
      <Component />
    )
  );
  
  return <ProtectedRoute path={path} component={WrappedComponent} />;
};

function Router() {
  return (
    <Switch>
      {/* Páginas Públicas */}
      <Route path="/" 
        component={() => <LayoutRoute component={Home} />} 
      />
      <Route path="/news" 
        component={() => <LayoutRoute component={NewsIndex} />} 
      />
      <Route path="/news/:slug" 
        component={() => <LayoutRoute component={NewsArticle} />} 
      />
      <Route path="/login" 
        component={() => <LayoutRoute component={LoginPage} />} 
      />
      <Route path="/terms" 
        component={() => <LayoutRoute component={TermsOfService} />} 
      />
      <Route path="/privacy" 
        component={() => <LayoutRoute component={PrivacyPolicy} />} 
      />
      <Route path="/team" 
        component={() => <LayoutRoute component={TeamPage} />} 
      />
      
      {/* Páginas que não exigem autenticação */}
      <Route path="/application" 
        component={() => <LayoutRoute component={Application} />} 
      />
      
      {/* Páginas Admin - Protegidas */}
      <ProtectedLayoutRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedLayoutRoute path="/admin/news" component={AdminNewsIndex} />
      <ProtectedLayoutRoute path="/admin/news/new" component={AdminNewsEditor} />
      <ProtectedLayoutRoute path="/admin/news/edit/:id" component={AdminNewsEditor} />
      <ProtectedLayoutRoute path="/admin/applications" component={AdminApplicationsIndex} />
      <ProtectedLayoutRoute path="/admin/applications/:id" component={AdminApplicationView} />
      <ProtectedLayoutRoute path="/admin/settings" component={AdminSettings} />

      {/* Fallback para 404 */}
      <Route path="/:rest*" 
        component={() => <LayoutRoute component={NotFound} />} 
      />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
