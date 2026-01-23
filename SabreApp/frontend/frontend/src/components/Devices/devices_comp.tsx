//import { useState } from 'react';
//import { buildPath } from '../../../../../backend/utils';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
socket.on("update", (arg) => {
    console.log(arg);
})

const Devices = () =>
{
    function toggleTest()
    {
        socket.emit("Test Balls", "Hello From React Dashboard");
    }
    return (
        <div>
            <span>
                test test test
            </span>
            <button onClick={toggleTest}>
                Test
            </button>
        </div>

    );
}

export default Devices;