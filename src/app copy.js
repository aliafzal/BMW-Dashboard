import express from 'express';
var path = require('path');
const bodyParser = require("body-parser");
import API, {VEHICLE_VIEWS}from './api';
import {initializeApi} from './Auth';
import {getStatus} from './dataManager';
import {statSchema, vehicleSchema} from './const';
import { cred } from './cred';

var app = express();
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//for react
//app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, './public')));

// State variables 
let vehicle;
let authStatus = false;
let authRefress = false;


let imageAddress = []

app.get('/data', (req,res) => {

    if(authStatus){
        try {
            vehicle.getStatus().then(s => {
                console.log(s);
                res.send(s);
            }).catch(err => {
                console.log('failed to get vehicle status');
                console.log(err);
            });
        } catch (err) {
          console.log('failed to create log');
          console.log(err);
        }
    }
    else{
        res.redirect('/');
    }
});

app.get('/', (req,res) => {
    if(!authStatus){
       initializeApi(cred.username,cred.password,cred.region);
       authStatus = true;
       try {
        API.getVehicles().then(v => {
            vehicle = v[0];
            res.redirect('/data');
        }).catch(err => {
            console.log('something went wrong getting the vehicle')
            console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
    else{
        res.redirect('/data');
    }
    
});

app.post("/",(req,res) => {
}); 


module.exports = app;