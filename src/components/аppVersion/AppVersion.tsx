import React, { useEffect, useState } from 'react';
import './аppVersion.css';

const AppVersion: React.FC = () => {
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const res = await fetch(process.env.PUBLIC_URL + '/version.txt');
                const text = await res.text();
                setVersion(text.trim());
            } catch (error) {
                console.error("Не вдалося завантажити версію:", error);
            }
        };

        fetchVersion();
    }, []);

    return (
        <div className="app-version">
            v{version}
        </div>
    );
};

export default AppVersion;
