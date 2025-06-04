import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import TimeDifferenceCalculator from './pages/timeDifferenceCalculator/TimeDifferenceCalculator';
import LoginPage from './pages/loginPage/LoginPage';
import SourcePage from './pages/sourcePage/SourcePage';
import { useDeviceFingerprint } from './utils/auth/auth';
import Spinner from './components/spinner/Spinner';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    useDeviceFingerprint();
    
    useEffect(() => {
        let fingerprint = localStorage.getItem("fingerprint");
        const checkAuth = async () => {
            console.log("Checking authentication...");

            try {
                const res = await fetch(`http://localhost:5000/check-devices?fingerprint=${fingerprint}`, {
                    method: "GET",
                    credentials: "include",
                });
                
                console.log("Authentication check response status:", res.status);

                if (res.ok) {
                    setIsLoggedIn(true);
                    console.log("User is logged in.");
                } else {
                    setIsLoggedIn(false);
                    console.log("User is not logged in.");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoggedIn === null) {
        console.log("Loading state...");
        return <Spinner />;
    }

    console.log("Rendering component:", isLoggedIn ? "TimeDifferenceCalculator" : "LoginPage");

    return (
        <Routes>
            <Route path="/Time-Difference-Calculator" element={
                isLoggedIn ? (
                    <TimeDifferenceCalculator />
                ) : (
                    <Navigate to="/Time-Difference-Calculator/login" replace />
                )
            } />
            <Route path='/Time-Difference-Calculator/login' element={
                isLoggedIn ? (
                    <Navigate to="/Time-Difference-Calculator" replace />
                ) : (
                    <LoginPage onLoginSuccess={() => {
                        console.log('Login succes callback called');
                        setIsLoggedIn(true);
                    }} />
                )
            } />
            <Route path='/Time-Difference-Calculator/sourse' element={<SourcePage />} />   
            <Route path="*" element={<Navigate to="/Time-Difference-Calculator" replace />} />         
        </Routes>
    );
}

export default App;
