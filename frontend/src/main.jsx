import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from "/@/context/AuthContext";
import CrossTabSync from "/@/components/CrossTabSync";
import {NotificationProvider} from "/@/components/notifications/NotificationProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <CrossTabSync />
          <AuthProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
          </AuthProvider>
      </QueryClientProvider>
  </React.StrictMode>
);