import React from 'react';
import networkRailLogo from '../assets/network_rail.png';

const NetworkRailAttribution = () => {
    return (
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Data Provided By</p>
            <img
                src={networkRailLogo}
                alt="Network Rail Logo"
                className="h-12 mx-auto"
            />
        </div>
    );
};

export default NetworkRailAttribution;