import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </I18nextProvider>
    </AuthProvider>
  </BrowserRouter>
);
