let express = require("express");
const app = express();
const path = require("path");
const con = require("./sqlcon.js");

app.use(express.static('public'));

require('dotenv').config()
const port = process.env.PORT

const cryptLib = require("cryptlib");
// encrypt string
const key=cryptLib.getHashSha256(process.env.ENC_KEY, 32);
encryptedText= cryptLib.encrypt('kenil donga',key, process.env.ENC_IV);
console.log(encryptedText)
// decrypt string
process.env.ENC_IV = process.env.ENC_IV + 1 ;
orignalText= cryptLib.decrypt(encryptedText,key, process.env.ENC_IV)
console.log(orignalText)

const multer = require('multer');
app.use(express.urlencoded({ extended : true }));

app.get('/', function (req, res) {
    con.query("SELECT * FROM image_insert WHERE is_active = 1 ORDER BY id DESC", function(err, result){
        if(err) throw err;
        console.log(result);
        res.render(path.join(__dirname+'/table.ejs'),{data:result})
    });
})


app.get('/insert', function (req, res) {
    res.render(path.join(__dirname+'/insert.ejs'))
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
  var upload = multer({ storage: storage })

app.post('/send_post', upload.single('image'), function(req, res){
    dataob = {
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        image: '',
        is_active: 1    
    }
    const file = req.file;
    if (!file) {
        dataob.image = 'no-image.jpg';
    }else{
        dataob.image = req.file.filename;
    }
    con.query(`INSERT INTO image_insert SET ?`, dataob ,function(err,result,fields){if(err) throw err;});
    res.redirect("/");
})


// Error Handler
app.use(function(req, res, next){
    res.render(path.join(__dirname+'/error.ejs'))
    res.status = 400;
    next();
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});