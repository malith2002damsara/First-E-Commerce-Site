import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Page</h1>
        <p className="text-gray-600">If you can see this, routing is working!</p>
        <p className="text-sm text-gray-500 mt-4">Current URL: {window.location.pathname}</p>
      </div>
    </div>
  );
};

export default TestPage;
