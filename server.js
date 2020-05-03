let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;

app.use(express.static('public'))

http.listen(PORT, () => {
    console.log('lisening');
})


io.on('connection', (socket) => {


    //on draw
    socket.on('drawing', (mouseObject) => {
        //socket.broadcast.emit('drawing', mouseObject.data);
        io.to(mouseObject.room).emit('drawing', mouseObject.data)
    });

    //on map change
    socket.on('mapchange', (map) => {
        //socket.broadcast.emit('mapchange', map.data);
        io.to(map.room).emit('mapchange', map.data)
    })

    socket.on('serverchange', (path) => {
        socket.leave(path.old)
        socket.join(path.new)
    })


});