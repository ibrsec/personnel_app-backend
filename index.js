"use strict";

/* -------------------------------------------------- */
/*              PERSONNEL API EXPRESS                 */
/* -------------------------------------------------- */

/* ------------------ IMPORTS ----------------- */
require('dotenv').config();
require('express-async-errors')
const swaggerUI = require('swagger-ui-express');
const redoc = require('redoc-express');
const cors = require('cors');
const path = require('path');




const authentication = require('./src/middlewares/authentication');
/* -------------------------------------------- */




/* ------------------ EXPRESS AND APP ----------------- */
const express = require('express');
const app = express();
/* -------------------------------------------- */

/* ------------------ DB connection ----------------- */
require('./src/config/dbConnection').dbConnection();
/* -------------------------------------------- */
 

/* ------------------ middlewares ----------------- */
//session cookies
app.use(express.json());
// query handler
app.use(require('./src/middlewares/queryHandler'));

//logger
app.use(require('./src/middlewares/logger'));

//authentication
app.use(authentication);

//swagger
/* ------------------ Swagger ----------------- */

app.use('/documents/json',(req,res)=>{
    res.sendFile('swagger.json',{root:'.'})
})

app.use('/swagger', express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));


const swaggerJSON = require('./swagger.json');
app.use('/documents/swagger', swaggerUI.serve,swaggerUI.setup(swaggerJSON,{ swaggerOptions: { persistAuthorization: true } }))

//redoc
app.use('/documents/redoc',redoc({specUrl:'/documents/json',title:'Redoc UI'}));

//cors
app.use(cors());
/* -------------------------------------------- */





/* -------------------------------------------- */

/* ------------------ IMPORTS ----------------- */
/* -------------------------------------------- */
/* ------------------ IMPORTS ----------------- */
/* -------------------------------------------- */
/* ------------------ IMPORTS ----------------- */
/* -------------------------------------------- */



/* ------------------ ROUTES ----------------- */
app.all('/',(req,res)=>{
    res.send('Welcome to the personnel api!')
})
/* Department Route ------------------- */
app.use('/departments',require('./src/routes/departmentRoute'));
/* Personnel Route ------------------- */
app.use('/personnels',require('./src/routes/personnelRoute'));
/* token Route ------------------- */
app.use('/tokens',require('./src/routes/tokenRoute'));
/* auth Route ------------------- */
app.use('/auth',require('./src/routes/authRoute'));



/* ------------------ error handler ----------------- */
app.use(require('./src/middlewares/errorHandler'))
/* -------------------------------------------- */


/* ------------------ PORT LISTEN ----------------- */
const PORT = process.env.PORT || 1000;
app.listen(PORT,()=> console.log('Server is running on',PORT))
/* -------------------------------------------- */









/**
 * index js=>
 *  use strict
 *  imports
 *      - dotenv
 *  express,app
 *  dbconnection
 *  middlewares
 *      - json parser
 *      authentocation
 *      session cookies
 *      query handler
 *      swagger
 *  routes
 *  errorhandler
 *  PORT and listen
 * ----------------------------
 * errorhandler + index js
 * db connection + indexjs
 * department model
 * personnel model
 * passwordEncryptor
 * department  route index js
 * express-async-errors index js
 * queryhandler indexjs
 * personnel controller routes index js
 * autogen at root
 * swagger json
 * swagger ui
 * redoc
 * logger morgan middle ware -> index js
 * token model routes index js
 * auth controller routes index js
 *  - login
 *  - current
 *  - logout
 * authenticatio mw
 * permissions
 *  isLogin
 *  isAdmin
 *  isLeadOrAdmin
 * all permissions are fixed and tested
 * 
 * 
 * 
 * 
 * page size = session cooikies ile ekle
 */



// require('./sync')();
// 