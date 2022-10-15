var url = require('url');
var adr = 'http://test.com/default.htm?year=2017&month=february&date=02';
var q = url.parse(adr, true);

console.log("find host name: " + q.host);
console.log("find path name: " + q.pathname);
console.log("find get req: " + q.search);
console.log("-----------");
var qdata = q.query;
console.log(qdata.year," ", qdata.month, " ", qdata.date);