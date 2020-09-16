"use strict";
function _interopDefault(e) {
    return e && "object" == typeof e && "default" in e ? e.default : e;
}
var axios = _interopDefault(require("axios")),
    querystring = _interopDefault(require("querystring")),
    moment = _interopDefault(require("moment")),
    axiosRetry = _interopDefault(require("axios-retry"));
const VEHICLE_VIEWS = { FRONTSIDE: "FRONTSIDE", FRONT: "FRONT", REARSIDE: "REARSIDE", REAR: "REAR", SIDE: "SIDE", DASHBOARD: "DASHBOARD", DRIVERDOOR: "DRIVERDOOR", REARBIRDSEYE: "REARBIRDSEYE" },
    SERVER_URLS = { us: "b2vapi.bmwgroup.us", eu: "b2vapi.bmwgroup.com", cn: "b2vapi.bmwgroup.cn:8592" },
    getHost = (e) => {
        if (SERVER_URLS[e]) return SERVER_URLS[e];
        throw new Error("Unsupported region. Supported values are us|eu|cn");
    };
class BMWURLs {
    constructor(e) {
        (this.region = e), (this.host = getHost(e));
    }
    getHost() {
        return this.host;
    }
    getAuthURL() {
        return `https://${this.host}/gcdm/oauth/token`;
    }
    getBaseURL() {
        return `https://${this.host}/webapi/v1`;
    }
    getVehiclesURL() {
        return `${this.getBaseURL()}/user/vehicles`;
    }
    getVehicleVinURL(e) {
        return `${this.getVehiclesURL()}/${e}`;
    }
    getVehicleStatusURL(e) {
        return `${this.getVehicleVinURL(e)}/status`;
    }
    getRemoteServiceStatusURL(e, t) {
        return `${this.getVehicleVinURL(e)}/serviceExecutionStatus?serviceType=${t}`;
    }
    getRemoteServiceURL(e) {
        return `${this.getVehicleVinURL(e)}/executeService`;
    }
    getVehicleImage(e, t, i, n) {
        return `${this.getVehicleVinURL(e)}/image?width=${t}&height=${i}&view=${n}`;
    }
}
const cbsData = (e = {}) => ({ description: e.cbsDescription, dueDate: e.cbsDueDate ? moment(e.cbsDueDate, "YYYY-MM") : null, remainingMileage: e.cbsRemainingMileage, state: e.cbsState, type: e.cbsType }),
    vehicleStatus = (e = {}) => ({
        digitalChargingServiceActivation: e.DCS_CCH_Activation,
        digitalChargingServiceOngoing: e.DCS_CCH_Ongoing,
        conditionBasedServicingData: e.cbsData ? e.cbsData.map(cbsData) : [],
        chargingConnectionType: e.chargingConnectionType,
        chargingLevelHv: e.chargingLevelHv,
        chargingStatus: e.chargingStatus,
        checkControlMessages: e.checkControlMessages,
        connectionStatus: e.connectionStatus,
        doorDriverFront: e.doorDriverFront,
        doorDriverRear: e.doorDriverRear,
        doorLockState: e.doorLockState,
        doorPassengerFront: e.doorPassengerFront,
        doorPassengerRear: e.doorPassengerRear,
        hood: e.hood,
        internalClock: e.internalDataTimeUTC ? moment(e.internalDataTimeUTC) : null,
        lastChargingEndReason: e.lastChargingEndReason,
        lastChargingEndResult: e.lastChargingEndResult,
        maxRangeElectric: e.maxRangeElectric,
        maxRangeElectricMls: e.maxRangeElectricMls,
        mileage: e.mileage,
        parkingLight: e.parkingLight,
        position: e.position,
        positionLight: e.positionLight,
        rearWindow: e.rearWindow,
        remainingFuel: e.remainingFuel,
        remainingRangeElectric: e.remainingRangeElectric,
        remainingRangeElectricMls: e.remainingRangeElectricMls,
        remainingRangeFuel: e.remainingRangeFuel,
        remainingRangeFuelMls: e.remainingRangeFuelMls,
        remainingRangeTotal: e.remainingRangeFuel + e.remainingRangeElectric,
        remainingRangeTotalMls: e.remainingRangeFuelMls + e.remainingRangeElectricMls,
        singleImmediateCharging: e.singleImmediateCharging,
        trunk: e.trunk,
        updateReason: e.updateReason,
        updateTime: e.updateTime ? moment(e.updateTime) : null,
        vehicleCountry: e.vehicleCountry,
        vin: e.vin,
        windowDriverFront: e.windowDriverFront,
        windowDriverRear: e.windowDriverRear,
        windowPassengerFront: e.windowPassengerFront,
        windowPassengerRear: e.windowPassengerRear,
        cached: !1,
    });
class Vehicle {
    constructor(e, t) {
        (this.originalData = e), (this.BMWURLs = new BMWURLs(t.region)), (this.API = t), (this.images = {}), (this.status = null);
    }
    get vin() {
        return this.originalData.vin;
    }
    get model() {
        return this.originalData.model;
    }
    async getStatus(e) {
        const { vehicleStatus: t } = await this.API.requestWithAuth(this.BMWURLs.getVehicleStatusURL(this.vin));
        return (this.status = t), this.status;
    }
    async getImage(e = 400, t = 400, i = VEHICLE_VIEWS.DASHBOARD) {
        if (this.images[`${i}:${e}:${t}`]) return this.images[`${i}:${e}:${t}`];
        const n = await this.API.requestWithAuth(this.BMWURLs.getVehicleImage(this.vin, e, t, i), { overwriteHeaders: { Accept: "image/png" }, responseType: "arraybuffer" });
        return (this.images[`${i}:${e}:${t}`] = `data:image/png;base64,${Buffer.from(n, "binary").toString("base64")}`), this.images[`${i}:${e}:${t}`];
    }
    async remoteService(e) {
        
        const binaryImage = await this.API.requestWithAuth(
            this.BMWURLs.getRemoteServiceURL(this.vin),
            { method: 'POST', postData : {serviceType: "FLASH_LIGHT"} }
        );
        return binaryImage;
    }
    get name() {
        const { yearOfConstruction: e, model: t, bodytype: i, brand: n } = this.originalData;
        return `${e} ${n} ${i} ${t}`;
    }
}
class Logger {
    init(e) {
        this.debug = e;
    }
    log(...e) {
        this.debug && console.log("[BMWStatus]:", ...e);
    }
}
var logger = new Logger();
axiosRetry(axios, { retries: 3 });
const sleep = (e = 0) => new Promise((t) => setTimeout(t, e));
class API {
    constructor() {
        this.initialized = !1;
    }
    async init({ region: e, username: t, password: i, debug: n = !1, skipVehicles: r = !1 }) {
        if (!e || !t || !i) throw new Error("You must specify all the required parameters (region, username, password)");
        return (
            (this.initialized = !0),
            (this.region = e),
            (this.username = t),
            (this.password = i),
            (this.vehicles = null),
            (this.BMWURLs = new BMWURLs(e)),
            (this.oauthToken = null),
            (this.refreshToken = null),
            (this.tokenExpiresAt = null),
            logger.init(n),
            logger.log("initialized API with", { region: e, username: t, password: i, debug: n }),
            r || (await this.getVehicles()),
            !0
        );
    }
    async requestWithAuth(e, { overwriteHeaders: t = {}, method: i = "GET", postData: n = {}, ...r } = {}) {
        if (!this.initialized) throw new Error("You called a function before init()");
        logger.log("making request", e), (!this.oauthToken || (this.tokenExpiresAt && moment().isAfter(this.tokenExpiresAt))) && (await this.getToken(), await sleep(200));
        const s = { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", Authorization: `Bearer ${this.oauthToken}`, ...t };
        let a;
        a = "GET" === i ? await axios.get(e, { headers: s, ...r }) : await axios.post(e, n, { headers: s, ...r });
        const { data: o } = a;
        return logger.log("request response", o), o;
    }
    async getToken() {
        if (!this.initialized) throw new Error("You called a function before init()");
        logger.log("getting token");
        const { username: e, password: t } = this,
            i = querystring.stringify({ grant_type: "password", scope: "authenticate_user vehicle_data remote_services", username: e, password: t }),
            n = { Authorization: "Basic blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg==", Credentials: "nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ" };
        logger.log("token data", { postData: i, headers: n });
        const { data: r } = await axios.post(this.BMWURLs.getAuthURL(), i, { headers: n });
        logger.log("token response", { data: r });
        const { access_token: s, expires_in: a, refresh_token: o } = r;
        console.log("access_token: ", s, "expires_in: ", a, "refresh_token ", o);
        (this.oauthToken = s), (this.refreshToken = o), (this.tokenExpiresAt = moment().add(a, "seconds"));
    }
    async getVehicles(e = !1) {
        if (!this.initialized) throw new Error("You called a function before init()");
        if (this.vehicles && !e) return this.vehicles;
        const { vehicles: t } = await this.requestWithAuth(this.BMWURLs.getVehiclesURL());
        return t && (this.vehicles = t.map((e) => new Vehicle(e, this))), this.vehicles;
    }
}
const exported = new API();
(exported.VEHICLE_VIEWS = VEHICLE_VIEWS), (module.exports = exported);
