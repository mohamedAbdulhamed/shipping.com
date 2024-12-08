import { Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./scenes/auth/login.tsx";
import RegisterForm from "./scenes/auth/register.tsx";

// Offers
// index
import Offers from "./scenes/users/offers/index.tsx";
// view
import ViewOffer from "./scenes/users/offers/view.tsx";

// Orders
// index
import Orders from "./scenes/users/orders/index.tsx";
// view
import ViewOrder from "./scenes/users/orders/view.tsx";
// new
import NewOrder from "./scenes/users/orders/new.tsx";

import Profile from "./scenes/users/profile.tsx";

import Notifications from "./scenes/users/notifications.tsx";

import Landing from "./components/layout/Landing.tsx";

// errors
import NotFoundPage from "./scenes/error/NotFound.tsx";
import UnauthorizedPage from "./scenes/error/Unauthorized.tsx";

import Topbar from "./components/layout/Topbar.tsx";

import RequireAuth from "./components/auth/RequireAuth.tsx";
import PersistLogin from "./components/auth/PersistLogin.tsx";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.ts";

import { ROLES } from "./config/constants.ts";
import { useTranslation } from "react-i18next";
import Notification from "./components/notification/Notification.tsx";

import { LoadingProvider } from "./context/LoadingProvider.tsx";
import { OrdersFiltersProvider } from "./context/OrdersFiltersProvider.tsx";

const App = () => {
  const [theme, colorMode] = useMode();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <LoadingProvider>
            <main className="content">
              <Topbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Private Routes */}
                <Route element={<PersistLogin suppressErrors silently  />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Landing />} />
                  <Route path="/index" element={<Landing />} />
                </Route>
                <Route element={<PersistLogin />}>
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.company, ROLES.admin]}
                      />
                    }
                  >
                    <Route path="/user/offers" element={<Offers />} />
                    <Route path="/user/offers/:id" element={<ViewOffer />} />
                  </Route>

                  <Route
                    element={
                      <RequireAuth allowedRoles={[ROLES.client, ROLES.admin]} />
                    }
                  >
                    <Route path="/user/orders/new" element={<NewOrder />} />
                  </Route>

                  {/* Orders */}
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[
                          ROLES.client,
                          ROLES.company,
                          ROLES.admin,
                        ]}
                      />
                    }
                  >
                    <Route
                      path="/user/orders"
                      element={
                        <OrdersFiltersProvider>
                          <Orders />
                        </OrdersFiltersProvider>
                      }
                    />
                    <Route path="/user/orders/:id" element={<ViewOrder />} />

                    <Route path="/user/profile" element={<Profile />} />
                    <Route path="/user/notifications" element={<Notifications />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Notification />
            </main>
          </LoadingProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
