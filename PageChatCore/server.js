var app = require('./app');
var port = process.env.PORT || 3001;
var logger = require('./app/logger');

app.listen(port, function () {
    logger.info('Express server listening on port ' + port);
});