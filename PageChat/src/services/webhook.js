const express = require('express');
const bodyParser = require('body-parser');
const http = require('http')
const socketIO = require('socket.io')
const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const server = http.createServer(app)

const io = socketIO(server)

let pageId = '';
let _socket = '';

app.route('/webhook')
.get(function (req, res) {
    return res.send(req.param('hub.challenge'));
})
.post(function (req, res) {
    let body = req.body;

    console.log(body);
    if(body.entry[0].id===pageId) {
        _socket.emit(pageId, body);
    }

    return res.send('ok')
})

io.on('connection', socket => {
    _socket = socket;
    // console.log('User connected')

    socket.on('subscribe', (data) => {
        pageId = data.pageId
    })


    socket.on('disconnect', () => {
        // console.log('user disconnected')
    })
})




server.listen(3030, function () {
    console.log('server is running on port 3030')
})