import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider } from "./store/AppContext";
import { ToastProvider } from "./store/ToastContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AppProvider>
);
