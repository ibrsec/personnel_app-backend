"use strict";


require('dotenv').config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;


/* ------------------------------------------------------- *
const options = {
    openapi:          <string>,     // Enable/Disable OpenAPI.                        By default is null
    language:         <string>,     // Change response language.                      By default is 'en-US'
    disableLogs:      <boolean>,    // Enable/Disable logs.                           By default is false
    autoHeaders:      <boolean>,    // Enable/Disable automatic headers recognition.  By default is true
    autoQuery:        <boolean>,    // Enable/Disable automatic query recognition.    By default is true
    autoBody:         <boolean>,    // Enable/Disable automatic body recognition.     By default is true
    writeOutputFile:  <boolean>     // Enable/Disable writing the output file.        By default is true
};
/* ------------------------------------------------------- */


// const swaggerAutogen = require('swagger-autogen')({openapi:'3.0.0', language:'tr-TR'})
const swaggerAutogen = require('swagger-autogen')()

const packageJson = require('./package.json');

const document = {
    info:{
        version: packageJson.version,
        title:packageJson.name,
        description:packageJson.description,
        termsOfService:"http:127.0.0.1:"+PORT,
        contact: { name: packageJson.author, email: 'qadir@clarusway.com' },
        license: { name: packageJson.license }
    },
    host: `${HOST}`,
    basePath:'/',
    schemes:['http','https'],
    securityDefinitions:{
        Token:{
            type:'apikey',
            in:'header',
            name:'Authorization',
            description: 'Simple Token Authentication * Example: <b>Token ...tokenKey...</b>'
        }
    },
    security:[
        {Token:[]}
    ],
    definitions:{
        "Department":require('./src/models/departmentModel').Department.schema.obj,
        "Personnel":require('./src/models/personnelModel').Personnel.schema.obj
    }

}

const routes = ['./index.js'];
const outputFile = './swagger.json';

//run
swaggerAutogen(outputFile,routes,document);