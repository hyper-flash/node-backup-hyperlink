let express = require("express");
const app = express();
const path = require("path");
const con = require("./sqlcon.js");
app.use(express.static('public'));

require('dotenv').config()
const port = process.env.PORT

const Validator = require('Validator');

const cryptLib = require("cryptlib");
const key = cryptLib.getHashSha256(process.env.ENC_KEY, 32);

const multer = require('multer');
app.use(express.urlencoded({ extended : true }));

// table all data show

app.get('/', function (req, res) {
    con.query("SELECT * FROM image_crud WHERE is_active = 1 ORDER BY id DESC", function(err, result){
        
        for(let i = 0; i < result.length; i++){
            result[i].password = cryptLib.decrypt(result[i].password,key, process.env.ENC_IV);
        }

        if(err) throw err;
        //console.log(result);
        res.render(path.join(__dirname+'/table.ejs'),{data:result})
    });
})

// delete code

app.get('/delete/:id', function(req, res){
    con.query(`UPDATE image_crud SET is_active = '0' WHERE image_insert.id = ${req.params.id}`)
    res.redirect("/")
})

// edit ejs form get data

app.get('/get_edit/:id', (req, res) =>{
    var id = req.params.id;
    con.query("SELECT * FROM image_crud WHERE id = ?", [id], (err, result) =>{
        orignalText = cryptLib.decrypt(result[0].password, key, process.env.ENC_IV);
        result[0].password = orignalText;
        if(!err){
            //console.log(result)
            res.render(path.join(__dirname+'/edit.ejs'), {data: result})
        }
    })
})

// insert ejs page

app.get('/insert', function (req, res) {
    res.render(path.join(__dirname+'/insert.ejs'))
})

// multer img conf

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) { 
            return cb(new Error('Please upload a image'))
        }else{
            cb(null, Date.now() + path.extname(file.originalname))
        }
      
    }
  })
  
  var upload = multer({ storage: storage, limits: { fileSize: 200000 } }) //kb limit

// insert ejs submit post data

app.post('/send_post', upload.single('image'), function(req, res, cb){
    datapost = {
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        image: '',
        is_active: 1
    }

    // encrypt string
    encryptedText = cryptLib.encrypt(req.body.password ,key, process.env.ENC_IV);
    datapost.password = encryptedText;

    const file = req.file;
    if (!file) {
        datapost.image = 'no-image.jpg';
    }else{
        datapost.image = req.file.filename;
    }
        con.query(`INSERT INTO image_crud SET ?`, datapost ,function(err,result,fields){
            if(err) throw err;
            //console.log(result);
            res.redirect("/");
        });
})

// edit ejs form submit data

app.post('/edit/:id', upload.single('editimage'), (req, res) => {
  
    const rules={
      first_name:'required|regex:/^[a-zA-Z\s]*$/',
      last_name:'required|regex:/^[a-zA-Z\s]*$/',
      email:'required|email',
      password:'required',
      phone:'required|integer'
    };
    
      const messages = {
        // custom message for based rules
        required: 'You forgot the :attr field',
        email: ':attr is not valid',
    };

  const v = Validator.make(req.body, rules, messages);
  
  if(v.fails()){
      const errors = v.getErrors();
      console.log(errors);
      con.query("SELECT * FROM image_crud ORDER BY id desc", function(err, result){
          if(err) throw err;
          orignalText = cryptLib.decrypt(result[0].password, key, process.env.ENC_IV);
          result[0].password = orignalText;
          res.render(path.join(__dirname+'/edit.ejs'),{ data:result,errors:errors })
      });
  }else
  {
    // encrypt string
    encryptedText = cryptLib.encrypt(req.body.password ,key, process.env.ENC_IV);

    datapost = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: encryptedText,
        phone: req.body.phone
    }

    const file = req.file;
    if (!file) {
        // no image
        con.query(`UPDATE image_crud SET ? WHERE id = ?`, [datapost, req.params.id])
    }else{
        datapost.image = req.file.filename;
        con.query(`UPDATE image_crud SET ? WHERE id = ?`, [datapost, req.params.id])
    }
    res.redirect("/");
  }
})

// Error Handler
app.use(function(req, res, next){
    res.render(path.join(__dirname+'/error.ejs'))
    res.status = 404;
    next();
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});