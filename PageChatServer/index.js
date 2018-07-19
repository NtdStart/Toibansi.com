var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var WebSocketServer, {Server} = require('uws');
var path = require('path');
var Routes = require('./src/routers/index');

const PORT = 3001;
const app = express();
app.server = http.createServer(app);


//app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({extended: false}));


app.wss = new Server({
    server: app.server
});


// static www files use express
const wwwPath = path.join(__dirname, 'www');

app.use('/', express.static(wwwPath));

app.routers = new Routes(app);


app.server.listen(process.env.PORT || PORT, () => {
    console.log(`App is running on port ${app.server.address().port}`);
});

