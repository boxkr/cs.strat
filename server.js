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
        socket.broadcast.emit('drawing', mouseObject);
        //console.log(mouseObject);
    });


});