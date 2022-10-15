let express = require("express");
const app = express();
const port = 8005
const path = require("path");
const con = require("./sqlcon.js");

app.use(express.urlencoded({ extended : true }));+

app.get('/', function (req, res) {
    con.query("SELECT * FROM temp WHERE is_active = 1", function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.render(path.join(__dirname+'/table.ejs'),{ data:result})
    });
})


app.get('/delete/:id', (req, res) =>{
    con.query(`UPDATE temp SET is_active = '0' WHERE temp.id = ${req.params.id}`)
    res.redirect('/');
});


  app.get('/get_edit/:id', (req, res) =>{
    var id = req.params.id;
    con.query("SELECT * FROM temp WHERE id = ?", [id], (err, result) =>{
        if(!err){
            console.log(result)
            res.render(path.join(__dirname+'/edit.ejs'), {data: result})
        }
    })
})

app.post('/edit/:id', (req,res) =>{
    var id = req.params.id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var phone = req.body.phone;

    console.log(id)

    con.query("UPDATE temp SET first_name= ?, last_name= ?, email= ?, phone= ?  WHERE id = ?", [first_name, last_name, email, phone, id], (err, result) =>{
        if(!err){
            con.query("select * from temp ", () => {
                res.redirect('/');
            });
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});