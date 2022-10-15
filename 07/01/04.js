var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    fs.appendFile('test.txt', ' This is text.', function (err) {
        if (err) throw err;
        console.log('Updated!');
      });
      
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');