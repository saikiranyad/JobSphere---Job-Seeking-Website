import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";

import UsersPage from "./pages/UsersPage";

import OrdersPage from "./pages/OrdersPage";

import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import { useState } from "react";
import TokenPage from "./pages/TokenPage";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    return (
        <>
            {token === "" ? (
                <Login setToken={handleLogin} />
            ) : (
                <div className="flex h-screen text-black overflow-hidden">
                    <div className="fixed inset-0 z-0">
                        <div className="absolute   opacity-80" />
                        <div className="absolute " />
                    </div>

                    <Sidebar onLogout={handleLogout} />

                    <Routes>
                        <Route path="/" element={<OverviewPage />} />
                        <Route path="/tokens" element={<TokenPage />} />
                        <Route path="/users" element={<UsersPage />} />
                     
                        <Route path="/orders" element={<OrdersPage />} />
                     
                        <Route path="/settings" element={<SettingsPage onLogout={handleLogout}/>} />
                    </Routes>
                </div>
            )}
        </>
    );
}

export default App;
