import express from 'express';
var path = require('path');
const bodyParser = require("body-parser");
import API, {VEHICLE_VIEWS}from './api';
import {getStatus} from './Auth';
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
app.use(express.static(path.join(__dirname, '../client/build')));
//app.use(express.static(path.join(__dirname, './public')));

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
let authStatus = false;
let dataCollected = false;
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
app.get('/force', async (req,res) => {
    State.find({},async (err,state) => {
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
        const vehicleJson = await getStatus(authStatus);
        vehicleData = dataMaker(vehicleJson,dataIndex);
        console.log(vehicleData);
        authStatus = true;
        startAuthTimer();
        saveDataToDB(vehicleData,Status);
        dataRefresh = false;
        console.log("Data Collected");
        dataCollected = true;
        console.log("......................................");
        res.send(vehicleData);
    });
});

app.get('/data', async (req,res) => {
    console.log("................Collection..................");
    console.log("Getting vehical data");
    if(dataRefresh){
        console.log("collection data from API");
        State.find({},async (err,state) => {
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
            const vehicleJson = await getStatus(authStatus);
            vehicleData = dataMaker(vehicleJson,dataIndex);
            console.log(vehicleData);
            authStatus = true;
            startAuthTimer();
            saveDataToDB(vehicleData,Status);
            dataRefresh = false;
            console.log("Data Collected");
            dataCollected = true;
            console.log("......................................");
            res.send(vehicleData);
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
            console.log("......................................");
            res.send(vehicleData);
        });
    }
});

app.get('/', async (req,res) => {
    res.send(express.static(path.join(__dirname, '../client/build/index.html')))
});

app.post("/",(req,res) => {
    console.log(req.body);
}); 


/* DB functions*/

function saveDataToDB(data, collection){
    let newData = new collection({
        ...data
    });
    newData.save();
}


module.exports = app;