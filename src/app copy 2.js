import express from 'express';
var path = require('path');
const bodyParser = require("body-parser");
import API, {VEHICLE_VIEWS}from './api';
import {initializeApi, auth} from './Auth';
import {dataMaker} from './dataManager';
import {stateSchema, statusSchema} from './const';
import { cred } from './cred';
const mongoose = require("mongoose");
var app = express();

//DB init
mongoose.connect("mongodb://localhost:3001/mycarDB",{ useUnifiedTopology: true ,useNewUrlParser: true});



//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//for react
//app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, './public')));

//Collections init
const Status = mongoose.model("status",statusSchema);
const State = mongoose.model("state",stateSchema);

State.updateOne({_id: "5efc35fc2a36c730b4b559bb"}, {$set: {'totalIndex': 0}}, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Updated");
    }
});


// State variables 
let vehicle;
let authStatus = false;
let dataCollected = false;
let count  = 1;
let authTimerID;
let dataRefresh = true;
let dataIndex;
let stateDocId;
// Data variable

let vehicleData;

//Reset auth based on API
function invalidateAuth(){
    console.log("Current Auth and refresh Status: ", authStatus, dataRefresh);
    authStatus = false;
    dataRefresh = true;
    console.log("Modified Auth and refresh Status: ", authStatus, dataRefresh);
    clearInterval(authTimerID);
}
function startAuthTimer(){
    authTimerID = setInterval(invalidateAuth,20000);
}
app.get('/force', (req,res) => {
    dataRefresh = true;
    console.log("Getting refreshed data");
    res.redirect('/data');

});

app.get('/data', (req,res) => {

    if(!authStatus){
        console.log("................Data..................");
        console.log("Need to get auth first");
        console.log("......................................");
        res.redirect('/');
    }
    else{
        console.log("................Collection..................");
        console.log("Getting vehical data");
        if(dataRefresh){
            console.log("collection data from API");
            State.find({},(err,state) => {
                if(err){
                    console.log(err);
                }
                dataIndex = state[0].totalIndex;
                stateDocId = state[0]._id;
                dataIndex +=1;
                State.updateOne({_id: state[0]._id}, {$set: {'totalIndex': dataIndex}}, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Updated");
                    }
                });
                try {
                    vehicle.getStatus().then(vehicleJson => {
                        console.log(vehicleJson);
                        vehicleData = dataMaker(vehicleJson,dataIndex);
                        saveDataToDB(vehicleData,Status);
                        dataRefresh = false;
                        console.log("Data Collected");
                        dataCollected = true;
                        console.log("Redirecting to get /");
                        console.log("......................................");
                        res.redirect('/');
                    }).catch(err => {
                        console.log('failed to get vehicle status');
                        console.log(err);
                    });
                } catch (err) {
                    console.log('failed to create log');
                    console.log(err);
                }

                
            });
        }
        else {
            console.log("Collection data from DB");
            Status.find({index: dataIndex},(err,vStatus) => {
                if(err){
                    console.log(err);
                }
                vehicleData = vStatus[0];
                dataCollected = true;
                console.log("Data Collected");
                dataCollected = true;
                console.log("Redirecting to get /");
                console.log("......................................");
                res.redirect('/');
            });
        }
    }
});

app.get('/', (req,res) => {

    if(!authStatus){
        console.log("................Auth..................");
        console.log("Attempting Auth");
        initializeApi(cred.username,cred.password,cred.region);
        authStatus = true;
        try {
            API.getVehicles().then(v => {
                vehicle = v[0];
                console.log("Setting auth Timer");
                startAuthTimer();
                console.log("Redirecting to get data from auth");
                console.log("......................................");
                res.redirect('/data');
            }).catch(err => {
                console.log('something went wrong getting the vehicle')
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }
    else if(dataCollected){
        console.log("................Sending..................");
        console.log("Sending Data");
        res.send(vehicleData);
        console.log("Data Invalidated");
        dataCollected = false;
        console.log("......................................");
    }
    else{
        console.log("................Collecting Data..................");
        count ++;
        console.log("Redirecting to get data from else ");
        console.log("......................................");
        res.redirect('/data');
    }
    
});

app.post("/",(req,res) => {
}); 


/* DB functions*/

function saveDataToDB(data, collection){
    let newData = new collection({
        ...data
    });
    newData.save();
}


module.exports = app;