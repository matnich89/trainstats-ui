import React, {useState, useEffect} from 'react'
import RailDataInfoNote from "./RailDataIInfoNote";
import NetworkRailAttribution from "./NetworkRailAttribution";

const NationalRailRealtime = () => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected ] = useState(false);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/trains');

        socket.onopen = () => {
            console.log('websocket open');
            setIsConnected(true);
        }

        socket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data)
                setData(data)
            } catch (error) {
                console.error(error)
            }
        };

        socket.onclose = () => {
            console.log('websocket close');
            setIsConnected(false)
        };

        return () => {
            socket.close();
        };
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Current Realtime National Rail Stats
            </h1>
            <p className="mb-4 text-lg">
                Connection status:
                <span className={isConnected ? "text-green-600" : "text-red-600"}>
          {isConnected ? ' Connected' : ' Disconnected'}
        </span>
            </p>
            {data ? (
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">On Time</h2>
                            <p className="text-3xl font-bold text-blue-600">{data.on_time}</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">Cancelled or Very Late</h2>
                            <p className="text-3xl font-bold text-blue-600">{data.cancelled_or_very_late}</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">Late</h2>
                            <p className="text-3xl font-bold text-blue-600">{data.late}</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">Total</h2>
                            <p className="text-3xl font-bold text-blue-600">{data.total}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-xl">Waiting for data...</p>
            )}
            <RailDataInfoNote />
            <NetworkRailAttribution />
        </div>
    );
}

export default NationalRailRealtime;