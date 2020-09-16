const fs = require('fs');

export function dataMaker(vehicleJson,indexNumber){
    let temp = {index: indexNumber, ...vehicleJson};
    delete temp.cbsData;
    delete temp.checkControlMessages;
    delete temp.DCS_CCH_Activation;
    delete temp.DCS_CCH_Ongoing;
    return temp;
}
export function getStatus(n){
    let rawdata = fs.readFileSync(`/Users/aliafzal/Web Dev Resources/BMW_API/bmw_api/src/sample_data/sample${n}.json`);
    return dataMaker(JSON.parse(rawdata),n);

}

/*

import express from 'express';
var path = require('path');
const bodyParser = require("body-parser");
import API, {VEHICLE_VIEWS}from './api';
import {getStatus} from './dataManager';
import {statSchema, vehicleSchema} from './const';
import {cred} from './cred'


var app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:3001/number1DB",{ useUnifiedTopology: true ,useNewUrlParser: true});

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//for react
//app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, './public')));

// State variables 
let AUTH = false;


app.get('/', (req,res) => {
    if(!AUTH){
        try {
            API.init({
                region: cred.region,
                username: cred.username,
                password: cred.password
              }).then(d => {
                  AUTH = true;
                  res.redirect('/auth');
              }
              ).catch( err => {
                  console.log('something went wrong initializing the session');
                  console.log(err);
              });
        } catch (err) {
          console.log('something went wrong trying to get the vehicle')
          console.log(err);
        }
    }
    else{
        res.redirect('/data')
    }
    
});

app.get('/auth', (req,res) => {
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
});

let imageAddress = []

app.get('/data', (req,res) => {
    try {
        vehicle.getStatus().then(s => {
            console.log(s);
            res.send(JSON.stringify(err));
        }).catch(err => {
            console.log('failed to get vehicle status');
            console.log(err);
            
        });
    } catch (err) {
      console.log('failed to create log');
      //console.log(err);
    }
});


const dd = getStatus(3);
//console.log(dd);
app.post("/",(req,res) => {
}); 

module.exports = app;




/*

app.get('/auth', (req,res) => {
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
});

let imageAddress = []

app.get('/data', (req,res) => {


    try {
        vehicle.getStatus.then(s => {
            console.log(s);
        }).catch(err => {
            console.log('failed to get vehicle status');
            console.log(err);
            res.send(JSON.stringify(err));
        });
    } catch (err) {
      console.log('failed to create log');
      //console.log(err);
    }
});

app.get('/', (req,res) => {
    if(!AUTH){
        try {
            API.init({
                region: 'us',
                username: 'aliafzal9323@gmail.com',
                password: '#Iamthesuper1'
              }).then(d => {
                  AUTH = true;
                  res.redirect('/auth');
              }
              ).catch( err => {
                  console.log('something went wrong initializing the session');
                  console.log(err);
              });
        } catch (err) {
          console.log('something went wrong trying to get the vehicle')
          console.log(err);
        }
    }
    else{
        res.redirect('/data')
    }
    
});


*/


/*sample*/
  /*const number1Schema = {
    decimal: Number,
    float: Number,
    double: Number
  };

  const disco = {
    decimal: 567899,
    float: 45.5454,
    double: 6789.1234566
  }
  const Number1 = mongoose.model("number1",number1Schema);

  let post = new Number1({
      ...disco
  });
  post.save(function(err){
    if(err){
      console.log(err);
    }
  });*/