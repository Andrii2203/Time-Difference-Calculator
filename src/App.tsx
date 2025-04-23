import React, { useState, useEffect } from 'react';
import TimeDifferenceCalculator from './pages/timeDifferenceCalculator/TimeDifferenceCalculator';
import LoginPage from './pages/loginPage/LoginPage';
import { useDeviceFingerprint } from './utils/auth/auth';

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
        return <div>Loading...</div>;
    }

    console.log("Rendering component:", isLoggedIn ? "TimeDifferenceCalculator" : "LoginPage");

    return (
        <div>
            {isLoggedIn ? (
                <TimeDifferenceCalculator />
            ) : (
                <LoginPage onLoginSuccess={() => {
                    console.log("Login success callback called");
                    setIsLoggedIn(true);
                }} />
            )}
        </div>
    );
}

export default App;
