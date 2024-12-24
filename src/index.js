const expressModule = require('express');
const app = expressModule();
const cors = require('cors');
const server = require('http').Server(app);
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 4000;
const HOST = '0.0.0.0';

const GetAllProduct = require('./Register/Register');

app
    .use(GetAllProduct)

server.listen(PORT, HOST, () => {
    console.log(`Server iniciado http://${HOST}:${PORT}`);
});
