const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const logFilePath = path.join(__dirname, '../access.log');
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const morganJSONFormat = () => JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    remote_addr: ':response-time',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
    user_agent: ':user-agent',
});

const logger = morgan(morganJSONFormat(), { stream: accessLogStream });

module.exports = logger;
