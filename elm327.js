// javascript sensor functions

function maf(code){
    code = parseInt(code);
    return code * 0.00132276;
}

function throttle_pos(code){
    code = parseInt(code);
    return code * 100.0 / 255.0;
}

function intake_m_pres(code, psi){ //  in kPa
    code = parseInt(code);
    psi = typeof psi !== 'undefined' ? psi : false;
    if (psi==true){
        return code;
    }else{
        return code / 0.14504;
    }
}

function rpm(code){
    code = parseInt(code);
    return code / 4;
}

function speed(code){
    code = parseInt(code);
    return code / 1.609;
}

function percent_scale(code){
    code = parseInt(code);
    return code * 100.0 / 255.0;
}

function timing_advance(code){
    code = parseInt(code);
    return (code - 128) / 2.0;
}

function sec_to_min(code){
    code = parseInt(code);
    return code / 60;
}

function temp(code){
    code = parseInt(code);
    return code - 40; 
}

function cpass(code){
    // fixme
    return code;
}

function fuel_trim_percent(code){
    code = parseInt(code);
    return (code - 128.0) * 100.0 / 128;
}

function dtc_decrypt(code){
    // first byte is byte after PID and without spaces
    num = parseInt(code.substring(0,2)); // A byte
    res = [];

    if (num){ // & 0x80 is mil light on
        mil = 1;
    }else{
        mil = 0;
    }
    // bit 0-6 are the number of dtc's. 
    // num = num & 0x7f;
    
    res.push(num);
    res.push(mil);
    
    numB = parseInt(code.substring(2,4)); // B byte
      
    for (var i=0; i<3; i++){
        res.push(b);
        //res.push(((numB>>i)&0x01)+((numB>>(3+i))&0x02));
    }
    numC = parseInt(code.substring(4,6)); // C byte
    numD = parseInt(code.substring(6,8)); // D byte
       
    for (var i=0; i<7; i++){
        // res.push(((numC>>i)&0x01)+(((numD>>i)&0x01)<<1));
    }
    //res.push(((numD>>7)&0x01)); // EGR SystemC7  bit of different
    
    return res;
}

function hex_to_bitstring(hex){
    var hex = hex.toString(); // force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


function decrypt_dtc_code(code){
    /// Returns the 5-digit DTC code from hex encoding
    dtc = [];
    current = code;
    for (var i=0; i<3; i++){
        if (current.length<4){
            return "ERROR! Tried to decode bad DTC: " + code;
        }
        tc = obd_sensors.parseInt(current.substring(0,1)); // typecode
        tc = tc >> 2;
        if (tc == 0){
            type = "P";
        }else if (tc == 1){
            type = "C";
        }else if (tc == 2){
            type = "B";
        }else if (tc == 3){
            type = "U";
        }else{
            return tc;
        }
        dig1 = str(obd_sensors.hex_to_int(current[0]) & 3);
        dig2 = str(obd_sensors.hex_to_int(current[1]));
        dig3 = str(obd_sensors.hex_to_int(current[2]));
        dig4 = str(obd_sensors.hex_to_int(current[3]));
        dtc.push(type+dig1+dig2+dig3+dig4);
        current = current.substring(-4);
    }
    return dtc;
}


SENSORS = [
    { name : "Supported PIDs", command : "0100", valueFn : hex_to_bitstring, unit : ""},
    { name : "Status Since DTC Cleared", command : "0101", valueFn : dtc_decrypt, unit : ""},
    { name : "DTC Causing Freeze Frame", command : "0102", valueFn : cpass, unit : ""},
    { name : "Fuel System Status", command : "0103", valueFn : cpass, unit : ""},
    { name : "Calculated Load Value", command : "0104", valueFn : percent_scale, unit : ""},
    { name : "Coolant Temperature", command : "0105", valueFn : temp, unit : "C"},
    { name : "Short Term Fuel Trim", command : "0106", valueFn : fuel_trim_percent, unit : "%"},
    { name : "Long Term Fuel Trim", command : "0107", valueFn : fuel_trim_percent, unit : "%"},
    { name : "Short Term Fuel Trim", command : "0108", valueFn : fuel_trim_percent, unit : "%"},
    { name : "Long Term Fuel Trim", command : "0109", valueFn : fuel_trim_percent, unit : "%"},
    { name : "Fuel Rail Pressure", command : "010A", valueFn : cpass, unit : ""},
    { name : "Intake Manifold Pressure", command : "010B", valueFn : intake_m_pres, unit : "psi"},
    { name : "Engine RPM", command : "010C", valueFn : rpm, unit : ""},
    { name : "Vehicle Speed", command : "010D", valueFn : speed, unit : "MPH"},
    { name : "Timing Advance", command : "010E", valueFn : timing_advance, unit : "degrees"},
    { name : "Intake Air Temp", command : "010F", valueFn : temp, unit : "C"},
    { name : "Air Flow Rate (MAF)", command : "0110", valueFn : maf, unit : "lb/min"},
    { name : "Throttle Position", command : "0111", valueFn : throttle_pos, unit : "%"},
    { name : "Secondary Air Status", command : "0112", valueFn : cpass, unit : ""},
    { name : "Location of O2 sensors", command : "0113", valueFn : cpass, unit : ""},
    { name : "O2 Sensor: 1 - 1", command : "0114", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 1 - 2", command : "0115", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 1 - 3", command : "0116", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 1 - 4", command : "0117", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 2 - 1", command : "0118", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 2 - 2", command : "0119", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 2 - 3", command : "011A", valueFn : fuel_trim_percent, unit : "%"},
    { name : "O2 Sensor: 2 - 4", command : "011B", valueFn : fuel_trim_percent, unit : "%"},
    { name : "OBD Designation", command : "011C", valueFn : cpass, unit : ""},
    { name : "Location of O2 sensors", command : "011D", valueFn : cpass, unit : ""},
    { name : "Aux input status", command : "011E", valueFn : cpass, unit : ""},
    { name : "Time Since Engine Start", command : "011F", valueFn : sec_to_min, unit : "min"},
    { name : "Engine Run with MIL on", command : "014E", valueFn : sec_to_min, unit : "min"}
];
     
