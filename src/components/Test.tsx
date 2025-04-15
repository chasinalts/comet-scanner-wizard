import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          COMET Scanner Wizard
        </h1>
        <p className="text-gray-600">
          System is initializing...
        </p>
      </div>
    </div>
  );
};

export default Test;