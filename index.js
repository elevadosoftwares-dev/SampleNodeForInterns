const express = require("express");
const server = express();
const cors = require('cors');
const path = require("path");

const port = process.env.PORT || 5000;
require("./db/config");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/", require("./app"));



server.use('/Data/Image', express.static(path.join(process.cwd(), "Media", "Data", "Image")));

server.get('/', (req, res) => {
    res.send(" Server is running ");
});

const http = require('http');

const { Server } = require('socket.io');

const socketServer = http.createServer(server);

const io = new Server(socketServer, {
    "cors": {
        origin: "*"
    }
});

io.on('connection', (socket) => {

    console.log("User Connected " + socket.id);

    socket.on('sendMessage', (data) => {
        console.log(data);
        socket.emit('newMessage', data)
    });

    socket.on('disconnect', () => {
        console.log(socket.id);
    })
})

socketServer.listen(port, (req, res) => {
    console.log(`Server is running on ${port}`)
})