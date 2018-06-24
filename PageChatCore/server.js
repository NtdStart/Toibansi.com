var app = require('./app/app');
var port = process.env.PORT || 3001;
var logger = require('./app/logger/index');

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    logger.info('Express server listening on port ' + port);
});