import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/useAuth";
import Dashboard from "./components/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import "./App.css";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "accounts" | "transactions"
  >("dashboard");
  const { user } = useAuth();

  if (user) {
    let page;
    if (currentPage === "dashboard") {
      page = <Dashboard />;
    } else if (currentPage === "accounts") {
      page = <Accounts />;
    } else if (currentPage === "transactions") {
      page = <Transactions />;
    }
    return (
      <>
        <nav className="app-navigation">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={currentPage === "accounts" ? "active" : ""}
            onClick={() => setCurrentPage("accounts")}
          >
            Accounts
          </button>

          <button
            className={currentPage === "transactions" ? "active" : ""}
            onClick={() => setCurrentPage("transactions")}
          >
            Transactions
          </button>
        </nav>

        {page}
      </>
    );
  }

  return (
    <>
      {showSignup ? (
        <Signup onSwitchToLogin={() => setShowSignup(false)} />
      ) : (
        <Login onSwitchToSignup={() => setShowSignup(true)} />
      )}
    </>
  );
}

export default App;
