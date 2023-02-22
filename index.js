'use strict'

/**
 * Created by: Daniel Proença
 * License: MIT
 * Email(personal): devillabdeveloper@gmail.com || danielproenca89@gmail.com
 * Email(professional): daniel.proenca@lbrtelecom.com.br
 * 
 */

const http = require('http')
const https = require('https')
const endPoints = require('./config/end_point.json')
const RouteMaker = require('./route-maker')
const fs = require('fs')
const uploadImage = require('./route-maker/UploadImage')
require("dotenv-safe").config();


const app = new RouteMaker(endPoints)



const Myapp = app.createRoute()

Myapp.post('/api/admin/employeePhoto', async (req, res)=>{

  const photoId = await uploadImage(req.body.photo)
  const conn = app.connections.siga
  conn.insert('photopath', {employee_id:req.body.employee_id, path:photoId})
  res.send({photoId})

})
const pathComp = require("express-static");

Myapp.use('/avatar', pathComp(__dirname + "/uploads"));


Myapp.get('/test',(req,res)=>{res.send('ok')})

/*const server = https.createServer({
    key: fs.readFileSync(__dirname+'/config/certificates/server.key'),
    cert: fs.readFileSync(__dirname+'/config/certificates/server.crt'),
  }, Myapp);*/

const server = http.createServer(Myapp);


server.listen(process.env.PORT);
console.log(`Servidor escutando na porta ${process.env.PORT}...`)