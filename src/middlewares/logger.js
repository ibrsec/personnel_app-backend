
// const morgan = require('morgan');


// const fs = require('node:fs');
// const now = new Date();

// const today = now.toISOString().split("T")[0];
// module.exports  = morgan('combined', {
// stream:fs.createWriteStream(`./logs/${today}.log`,{flags:'a+'})
// })



const morgan = require('morgan');
const fs = require('node:fs');
const path = require('node:path');
const now = new Date();

const today = now.toISOString().split("T")[0];
const logDirectory = path.join(__dirname, 'logs');

// Log dosyasının kaydedileceği dizinin varlığını kontrol edin
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDirectory, `${today}.log`), { flags: 'a+' });

module.exports = morgan('combined', { stream: logStream });

