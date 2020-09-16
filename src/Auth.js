import {cred} from './cred'
import API from './api';

// State Variables
let currentVehicles,vehicle;

const initializeApi = async (username, password, reg) => {
    await API.init({
        region: reg,
        username,
        password,
    });
};

export async function getStatus(authStatus){
    try {
        if(!authStatus){
            console.log("Auth ")
            initializeApi(cred.username,cred.password,cred.region);
            currentVehicles = await API.getVehicles();
            vehicle = currentVehicles[0];
        }
        console.log("Getting vehicle .................");
        vehicle = await currentVehicles[0].getStatus();
        console.log("Got vehicle .................")
    }catch{
        console.log('err', e);
    } finally{
        //console.log(vehicle);
        return vehicle;
    }
}



/*
try {
    await API.init({
        region: 'eu',
        username: 'a@gmail.com',
        password: 'b',
        debug: true,
    });

    const currentVehicles = await API.getVehicles();
    console.log('currentVehicles', currentVehicles);
    const image = await currentVehicles[0].getImage();
    console.log('img', image);
} catch (e) {
    console.log('err', e);
}*/