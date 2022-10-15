var filesystem = require('fs');
//Delete the file mynewfile2.txt:
filesystem.unlink('test.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});