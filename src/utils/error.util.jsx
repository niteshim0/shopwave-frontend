import React from 'react';
import { useLocation } from 'react-router-dom';

const Error = () => {
  const location = useLocation();

  return (
    <div>
      <h2>Error: 404 Not Found</h2>
      <p>The requested URL <code>{location.pathname}</code> was not found on this server.</p>
    </div>
  );
};

export default Error;
