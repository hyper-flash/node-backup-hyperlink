var http = require('http');
var moment = require('moment');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(('\n')+ moment().format('MMMM Do YYYY, h:mm:ss a') +  // print month / 
  ('\n') + (moment().format('dddd'))+  // print day
  ('\n') + (moment().format("MMM Do YY"))+ // 
  ('\n') + (moment().add(2, 'days').calendar())+
  ('\n') + (moment().subtract(3, 'days').calendar()));
}).listen(8080);