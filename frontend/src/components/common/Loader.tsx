import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
    );
};

export default Loader;
