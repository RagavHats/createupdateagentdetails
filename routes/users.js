const router = require('express').Router();
let mysql  = require('mysql');
let config = require('../config.js');
let connection = mysql.createConnection(config);

var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
// ADDING A NEW USER WITH PASSWORD token validation

router.route('/signin').post((req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {

        
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email , password], async function(error, results, fields) {

            let user = results[0];

                if(user) {
                    //login
                   const token = jwt.sign({ _id: email }, "sdfff");
                    res.cookie("token",token , {expire : new Date() + 9999})
                   return res.json({
                        message: token
                    });
                }else{
                    return res.status(403).json({
                    error: "Incorrect Username and/or Password!"
                    });
                }

        });
    } else {
        res.send('Please enter Username and Password!');
    }
});


// ADding a 
router.route('/add').post((req,res) =>{

 let createagent = `CREATE TABLE IF NOT EXISTS agency (agencyid TEXT,name TEXT,address1 TEXT,address2 TEXT, state TEXT,city TEXT, phonenumber TEXT)`;
           connection.query(createagent);     
 let createclient = `CREATE TABLE IF NOT EXISTS client (agencyid TEXT,clientid TEXT,clientname TEXT, clientemail TEXT, clientphone TEXT,totalbill TEXT) `;
        connection.query(createclient);

    // Agency data 
    const agencyId = req.body.agencyid;
    const name = req.body.name;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const state = req.body.state;
    const city = req.body.city;
    const phonenumber = req.body.phonenumber;

     // Client Data ...
    
    const clientId = req.body.clientid;
    const clientname = req.body.clientname;
    const clientemail = req.body.clientemail;
    const clientphone = req.body.clientphone;
    const totalBill  = req.body.totalbill ;


    if(!agencyId || !name || !address1 || !state || !city || !phonenumber || !clientId || !clientname || !clientemail ||
      !clientphone || !totalBill)
      {
        return res.send('Required some details');
      }else{
let sql = `INSERT INTO agency (agencyid,name,address1 ,address2 , state ,city , phonenumber)
                VALUES('${agencyId}','${name}','${address1}','${address2}' ,'${state}','${city}','${phonenumber}')`;
    // execute the insert statment
    connection.query(sql,function(err, results) {
           
            if (results.affectedRows === 0) { 
                
                 return res.status(420).send("Error Inserting Agency");
             }else{
                  res.send('Agency is added');
             } 
        });
   

   

   let clientsql = `INSERT INTO client (agencyid,clientid,clientname , clientemail,clientphone,totalbill)
                VALUES('${agencyId}','${clientId}','${clientname}','${clientemail}','${clientphone}','${totalBill}')`;
    // execute the insert statment
    connection.query(clientsql,function(err, results) {
           
            if (results.affectedRows === 0) { 
                
                 return res.status(400).send("Error Inserting Client");
             }else{
                  res.send('Client is added');
             } 
        });

      }


    

});

/// Update the client Details according to the agency id ....


router.route('/update/:id').post((req,res) =>{
    var id = req.params.id;
    const clientId = req.body.clientid;
    const clientname = req.body.clientname;
    const clientemail = req.body.clientemail;
    const clientphone = req.body.clientphone;
    const totalBill  = req.body.totalbill ;



    if(!id  || !clientId || !clientname || !clientemail || !clientphone || !totalBill)
    {
        return res.send('Required some details');
    }else{
        if(id === "")
        {
            res.send("No Id");
        }else{
            let clientsqlexe = `UPDATE client SET clientid = '${clientId}', 
                            clientname ='${clientname}', clientemail='${clientemail}',
                            clientphone ='${clientphone}',totalbill='${totalBill}' WHERE agencyid = '${id}'`;
        
        
            connection.query(clientsqlexe ,function(err, results) {
            
                if (results.affectedRows === 0) { 
                    
                    return res.status(400).send("error Not Updated");
                }else{
                    res.send('Client are updated');
                } 
            });
        
        
        }
    }
    
});

//// Fetch all the details client and agency details ...

router.route('/agents').get((req,res) =>{
    var query = "SELECT agency.name , client.clientname , client.totalbill as totalbill FROM agency " +
                " INNER JOIN client ON agency.agencyid = client.agencyid  Order By totalbill DESC" ; 
    connection.query(query, async function(error, results, fields) {
        let user = results;
        if (!user) {
        return res.status(400).json({
            error: "No agent was found in DB"
        });
        }
        res.send(user)
    });
});

module.exports = router;