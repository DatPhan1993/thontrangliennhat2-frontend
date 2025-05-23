import React from 'react';

const DebugEnv = () => {
    const envVars = {
        REACT_APP_API_URL: process.env.REACT_APP_API_URL,
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
        REACT_APP_PUBLIC_URL: process.env.REACT_APP_PUBLIC_URL,
        NODE_ENV: process.env.NODE_ENV
    };

    return (
        <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: 'black', 
            color: 'white', 
            padding: '10px', 
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px',
            borderRadius: '5px'
        }}>
            <h4>Environment Variables Debug:</h4>
            {Object.entries(envVars).map(([key, value]) => (
                <div key={key}>
                    <strong>{key}:</strong> {value || 'undefined'}
                </div>
            ))}
        </div>
    );
};

export default DebugEnv; 