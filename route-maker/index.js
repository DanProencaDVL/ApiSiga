'use strict'

/**
 * Created by: Daniel Proença
 * License: MIT
 * Email(personal): devillabdeveloper@gmail.com || danielproenca89@gmail.com
 * Email(professional): daniel.proenca@lbrtelecom.com.br
 * 
 */

const EasyCrud = require('./EasyCrud')
const http = require('http'); 
const express = require('express'); 
const app = express();
const bodyParser = require('body-parser')
app.use(express.json());
require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 
const config = require('../config/config.json')
const cors = require('cors')

app.use(cors({
    origin: '*'
}));


module.exports = class RouteMaker{

    constructor(routes){

        this.routes = routes
        this.app = app
        this.auth = false
        this.verify = false
        this.connections = {}
        
    }
    
    verifyJWT(req, res, next){
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });       
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
    }


    pass(req,res, next){

        next()

    }

    createConection(){
        Object.keys(config).forEach(name=>{
            this.connections[name] = new EasyCrud(config[name])
            this.connections[name].connect()
        })

        
    }

    createRoute(){

        this.createConection()
       
        this.routes.forEach((e,i)=>{
            
       

            if(e.method === 'GET'){
             app.get('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass, async (req, res, next) => { 
                
               
                const request = req.query?req.query:null

                const conn = this.connections[e.name]
                
                const query = await conn.get_result(e.query, request)

                return res.json(query)

            })
            }



            if(e.method === 'POST'){
                app.post('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = this.connections[e.name]
                    conn.connect()
                    const query = conn.insert(e.table, req.body)
    
                    return res.json(query)
    
                })
          
            }

            if(e.method === 'PUT'){
                app.put('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = this.connections[e.name]
                    conn.connect()
                    const query = conn.update(e.table, req.body.data, req.body.where)
    
                    return res.json(query)
    
                })
          
            }

            if(e.method === 'DELETE'){
                app.delete('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = this.connections[e.name]
                    conn.connect()
                    const query = conn.delete(e.table, req.body.data)
    
                    return res.json(query)
    
                })
          
            }
            
            if(e.method === 'login'){
                app.post('/'+e.path, async (req, res, next) => { 
                
                    const conn = this.connections[e.name]
                    conn.connect()
    
                    console.log(req.body)

                    const body =  Object.values(req.body)
                    const query = await conn.get_result(e.query, {username:body[0], password:body[1]})

                    console.log()
                    
                    if(query[0]){ 
                    const id = query[0].id; 
                    const token = jwt.sign({ id }, process.env.SECRET, {
                      expiresIn: "356 days"
                    });

                    conn.insert("sessions", {userId:query[0].id, token:token})

                    return res.json({ auth: true, type:query[0].type, name:query[0].name, id:query[0].id, sector:query[0].sector ,token: token, path:query[0].path ,message:'ok'});

                    }else{
                    return res.status(500).json({auth:false, message: 'Invalid Login!'});
                    }
                 
    
                })


                app.get('/islogged',this.verifyJWT,(req,res,next)=>{
                    res.status(200).json({auth:true})
                    
                })
          
            }
          

          
            })

            return app

    }


}