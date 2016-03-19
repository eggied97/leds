var app = require('express')();
var http = require('http');
var socketio = require('socket.io');
var sp = require("serialport");
var SerialPort = sp.SerialPort;

var arduinoConnected = true; //set to false if no arduino is connected, for testing purposes.
var COMPORT = "/dev/ttyACM0";      //TODO change CONMPORT to the comport of the arduino

if (arduinoConnected){
  var serialPort = new SerialPort(COMPORT, {
    baudrate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: sp.parsers.readline('\r\n')
  });
}

var server = https.createServer(options, app).listen(3000, function() {
  console.log('listening on *:3000');
});

var io = socketio.listen(server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/views/index.html');
  console.log('index requested');
});


if (arduinoConnected) {
  serialPort.on("open", function () {
    console.log('serialport has made connnection');

    serialPort.on('data', function (data) {
      console.log('data received: ' + data);
      //TODO maybe something?

    });
  });


    /**
     * When we experience an error with the communication with the arduino,
     * spit it out
     * */
    serialPort.on('error', function (err) {
      console.error("error", err);
    });
}

io.on('connection', function(socket) {
  console.log("connected");


  socket.on('changeColor', function(color){
      socket.emit("colorChanged", color);
      pushStringToArduino("#"+color);
  });

});


var pushStringToArduino = function(msg){

  console.log("Sending to arduino: "+msg);

  if (arduinoConnected){
    serialPort.write(msg, function(err, results) {
      if (err) throw err;

      console.log('results ' + results);
    });
  }
}