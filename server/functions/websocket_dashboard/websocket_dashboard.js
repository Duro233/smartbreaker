export function webSocketDashboard(io, espSocket)
{
    // Websocket Interface w/ Respect to Frontend
    io.on("connection", (socket) => {
    console.log("Dashboard Client connected:", socket.id);
    //console.log("EspSocket Test: ", espSocket);

    socket.on("Test Balls", (msg) => {
        console.log("Message received:", msg);
        try 
        {
        if(espSocket === null)
            throw new Error("ESP Client is Not Connected");
        espSocket.sendTo(`${msg}`);
        }
        catch (error)
        {
        console.log("beef", error);
        console.log(espSocket);
        } 
    });

    socket.on("disconnect", () => {
        socket.off();
        console.log("Client disconnected:", socket.id);
    });
    });
}
