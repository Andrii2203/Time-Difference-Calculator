import React from "react";
import { useNavigate } from "react-router-dom";
import AppVersion from "../../components/аppVersion/AppVersion";
import './sourcePage.css'
const SourcePage: React.FC = () => {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate('/Time-Difference-Calculator/login', { replace: true });
    }
    return (
        <div className="source-page">
            <h1>How to use</h1>
            <p>This is simple guide on how to use this application</p>
            <p>Welcome to Sourse page!</p>
            <button type="button" className="source-button" onClick={handleBackToLogin}>Login</button>
            <AppVersion />
        </div>
    )
}

export default SourcePage;