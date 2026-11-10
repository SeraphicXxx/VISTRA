import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
    QueryCache,
    MutationCache,
} from "@tanstack/react-query";
import { AuthProvider } from "/@/context/AuthContext";
import CrossTabSync from "/@/components/CrossTabSync";
import {NotificationProvider, useNotify} from "/@/components/notifications/NotificationProvider";

function getErrorMessage(error) {
    return error?.message || "Something went wrong. Please try again.";
}

function QueryClientWrapper({ children }) {
    const notify = useNotify();
    const [queryClient] = useState(() => new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                notify.error(getErrorMessage(error), { title: "Request failed" });
            },
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                notify.error(getErrorMessage(error), { title: "Action failed" });
            },
        }),
    }));

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <CrossTabSync />
      <AuthProvider>
          <NotificationProvider>
              <QueryClientWrapper>
                <App />
              </QueryClientWrapper>
          </NotificationProvider>
      </AuthProvider>
  </React.StrictMode>
);