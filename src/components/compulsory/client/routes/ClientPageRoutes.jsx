import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientDashboard from '../../../client/ClientDashboard';
import AllArticlesHistory from '../../../features/articleHistory/AllArticlesHistory';
import BulkArticleGenerationForm from '../../../features/writeInfoArticle/BulkArticleGenerationForm';
import MainLayout from '../MainLayout';
import ViewSpecificArticle from '../../../features/articleHistory/ViewSpecificArticle';
import DetailsSpecificArticle from '../../../features/articleHistory/DetailsSpecificArticle';
import EditSpecificArticle from '../../../features/articleHistory/EditSpecificArticle';
import ClientRegister from '../../../client/ClientRegister';
import ClientLogin from '../../../client/ClientLogin';
import ClientPublicRoutes from './ClientPublicRoutes';
import ClientPrivateRoutes from './ClientProtectedRoutes';
import EmailVerification from '../../../client/EmailVerification';
import ClientForgotPasswordResetEmail from '../../../client/ClientForgotPasswordResetEmail';
import ClientForgotPasswordResetConfirmation from '../../../client/ClientForgotPasswordResetConfirmation';
import ClientProfileDetails from '../../../client/ClientProfileDetails';
import ClientSettings from '../../../client/ClientSettings';
import { SidebarProvider } from '../contexts/ClientSidebarContext';
import PlansAndPackages from '../../../features/PlansAndPackages';

function ClientPageRoutes() {
  return (
    <>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* The following routes are for the client side */}
            <Route
              path="/client/register"
              element={
                <ClientPublicRoutes>
                  <ClientRegister />
                </ClientPublicRoutes>
              }
            />
            <Route
              path="/client/login"
              element={
                <ClientPublicRoutes>
                  <ClientLogin />
                </ClientPublicRoutes>
              }
            />
            <Route
              path="/client/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route
              path="/client/forgot-password"
              element={
                <ClientPublicRoutes>
                  <ClientForgotPasswordResetEmail />
                </ClientPublicRoutes>
              }
            />
            <Route
              path="/client/reset-password"
              element={
                <ClientPublicRoutes>
                  <ClientForgotPasswordResetConfirmation />
                </ClientPublicRoutes>
              }
            />
            {/* Protected routes that require authentication */}
            <Route
              path="/"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <ClientDashboard />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <ClientDashboard />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <ClientProfileDetails />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/client/settings"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <ClientSettings />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            ></Route>
            <Route
              path="/all-post-history"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <AllArticlesHistory />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/bulk-article-generation"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <BulkArticleGenerationForm />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/article-details/:id"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <DetailsSpecificArticle />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/view-article/:id"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <ViewSpecificArticle />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/edit-article/:id"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <EditSpecificArticle />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
            <Route
              path="/plans-packages"
              element={
                <ClientPrivateRoutes>
                  <MainLayout>
                    <PlansAndPackages />
                  </MainLayout>
                </ClientPrivateRoutes>
              }
            />
          </Routes>
        </Router>
      </SidebarProvider>
    </>
  );
}

export default ClientPageRoutes;
