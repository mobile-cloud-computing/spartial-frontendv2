import React from 'react';

const ProtectedComponent: React.FC = () => {
    return (
        <div>
            <h1>Protected Page</h1>
            <p>Welcome to Spatial. This is a protected page. Only authenticated users can see this.</p>
        </div>
    );
};

export default ProtectedComponent;
