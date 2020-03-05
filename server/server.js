import { Klimaatje } from './klimaatje';
import { WeatherReceiver } from './weather-receiver';
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const klimaatje = new Klimaatje();
let weatherReceiver = null;

app.use(express.static('client/'));
app.get('/', function (req, res, next) {
  res.serveFile('index.html');
});

const port = process.env.PORT || 3000;
server.listen(port);
process.on('warning', e => console.warn(e.stack));
console.log(klimaatje);
klimaatje
  .init()
  .then(() => {
    weatherReceiver = new WeatherReceiver(io, klimaatje);
  })
  .catch(error => console.error(error));

console.log(`Server listening on http://localhost:${port}`);
