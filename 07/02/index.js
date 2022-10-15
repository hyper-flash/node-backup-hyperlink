var express = require('express');
var app = express();
const Validator = require('Validator');
const port = 7005

const path = require("path");
const con = require("./sqlcon.js");

app.use(express.urlencoded({ extended : true }));

app.get('/', function(req, res){
    console.log(req)
    res.send("<a href='/get'>Click Get</a><br><a href='/post'>Click Post</a>");
})

app.get('/get', function(req, res){
    console.log(req);
    res.render(path.join(__dirname+'/get.ejs'))
})

app.get('/send_get', function(req, res){
    console.log(req.query)
    console.log(req.query.fname)
    console.log(req.query.lname)
    res.send('Hello '+req.query.fname+ ' ' + req.query.lname);
})

app.get('/post', function (req, res) {
    con.query("SELECT * FROM temp", function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.render(path.join(__dirname+'/post.ejs'),{ data:result })
    });
})

app.get('/data', function (req, res) {
    con.query("SELECT * FROM temp", function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.render(path.join(__dirname+'/table.ejs'),{ data:result})
    });
})

app.post('/send_post', function(req, res){
    console.log(req.body)
    
    const rules={
        fname:'required',
        lname:'required',
        email:'required|email',
        phone:'required|integer'
    };
    const v = Validator.make(req.body, rules);

    if(v.fails()){
        const errors = v.getErrors();
        console.log(errors);
        
        con.query("SELECT * FROM temp", function(err, result, fields){
            if(err) throw err;
            console.log(result);
            res.render(path.join(__dirname+'/post.ejs'),{ data:result,errors:errors })
        });
    }else
    {
        con.query("INSERT INTO temp SET ?",req.body ,function(err,result,fields){
            if(err) throw err;
            console.log(result);
            res.send('hello' +  " " + req.body.fname + " " + req.body.lname);
        });
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


