import React, { useState } from "react";
import { globalStyle } from "./styles/globalStyle.js";
import { useToast } from "./hooks/useToast.js";
import Toast from "./components/Toast.jsx";

import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import QueryPage from "./pages/QueryPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";

export default function App() {
  const [page, setPage] = useState("signup");
  const [user, setUser] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const { toasts, push, pushOnce } = useToast();

  const onNav = (p, params) => {
    setPage(p);
    if (params) setSearchParams(params);
  };

  const onLogin = (u) => {
    setUser(u);
    setPage("dashboard");
  };

  const onLogout = () => {
    setUser(null);
    setPage("login");
    push("Logged out successfully.", "info");
  };

  return (
    <>
      <style>{globalStyle}</style>
      <Toast toasts={toasts} />
      {page === "signup" && <SignUpPage onNav={onNav} push={push} />}
      {page === "login" && (
        <LoginPage
          onNav={onNav}
          push={push}
          pushOnce={pushOnce}
          onLogin={onLogin}
        />
      )}

      {page === "dashboard" && user && (
        <DashboardPage user={user} onLogout={onLogout} onNav={onNav} push={push} />
      )}

      {page === "query" && user && (
        <QueryPage user={user} onLogout={onLogout} onNav={onNav} push={push} />
      )}

      {page === "results" && user && (
        <ResultsPage
          user={user}
          onLogout={onLogout}
          onNav={onNav}
          push={push}
          searchParams={searchParams}
        />
      )}

      {page === "insights" && user && (
        <InsightsPage
          user={user}
          onLogout={onLogout}
          onNav={onNav}
          results={searchParams?.results}
          query={searchParams?.query}
          mode={searchParams?.mode}
        />
      )}
    </>
  );
}