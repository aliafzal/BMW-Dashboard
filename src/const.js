export const statusSchema = {
    index: Number,
    vin: String,
    mileage: Number,
    updateReason: String,
    updateTime: String,
    doorDriverFront: String,
    doorDriverRear: String,
    doorPassengerFront: String,
    doorPassengerRear: String,
    windowDriverFront: String,
    windowDriverRear: String,
    windowPassengerFront: String,
    windowPassengerRear: String,
    sunroof: String,
    trunk: String,
    rearWindow: String,
    hood: String,
    doorLockState: String,
    parkingLight: String,
    positionLight: String,
    remainingFuel: Number,
    remainingRangeFuel: Number,
    remainingRangeFuelMls: Number,
    fuelPercent: Number,
    position: { lat: Number, lon: Number, heading: Number, status: String },
    internalDataTimeUTC: String,
    singleImmediateCharging: Boolean,
    vehicleCountry: String
  };

export const stateSchema = {
    totalIndex: Number
};