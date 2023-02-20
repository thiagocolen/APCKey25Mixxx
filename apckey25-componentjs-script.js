// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

// Declare the variable for your controller and assign it to an empty object
var ApcKey25 = {};

ApcKey25.init = function (id, debugging) {
    print("----->>> init()");
    print("----->>> id:" + id + " debugging:" + debugging);
};

ApcKey25.shutdown = function () {
    // send whatever MIDI messages you need to turn off the lights of your controller
};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

// TODO: remove this shit or make it better
ApcKey25.printParameters = function (channel, control, value, status, group) {
    print("------>>> channel:" + channel);
    print("------>>> control:" + control);
    print("------>>> value:" + value);
    print("------>>> status:" + status);
    print("------>>> group:" + group);
};

Led_Color = {
    off: 0x00,
    green: 0x01,
    blinkGreen: 0x02,
    red: 0x03,
    blinkRed: 0x04,
    yellow: 0x05,
    blinkYellow: 0x06,
};

Pad_Matrix = {
    scene_1: {
        1: 0x20,
        2: 0x21,
        3: 0x22,
        4: 0x23,
        5: 0x24,
        6: 0x25,
        7: 0x26,
        8: 0x27,
    },
    scene_2: {
        1: 0x18,
        2: 0x19,
        3: 0x1A,
        4: 0x1B,
        5: 0x1C,
        6: 0x1D,
        7: 0x1E,
        8: 0x1F,
    },
    scene_3: {
        1: 0x10,
        2: 0x11,
        3: 0x12,
        4: 0x13,
        5: 0x14,
        6: 0x15,
        7: 0x16,
        8: 0x17,
    },
    scene_4: {
        1: 0x08,
        2: 0x09,
        3: 0x0A,
        4: 0x0B,
        5: 0x0C,
        6: 0x0D,
        7: 0x0E,
        8: 0x0F,
    },
	scene_5: {
        1: 0x00,
        2: 0x01,
        3: 0x02,
        4: 0x03,
        5: 0x04,
        6: 0x05,
        7: 0x06,
        8: 0x07,
    },

};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

ApcKey25.isShiftPress = false;

ApcKey25.Shift = function (channel, control, value, status, group) {
    ApcKey25.printParameters(channel, control, value, status, group);

    if (status === 144) {
        ApcKey25.isShiftPress = true;
    } else {
        ApcKey25.isShiftPress = false;
    }
};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

ApcKey25.Play = function (channel, control, value, status, group) {
    ApcKey25.printParameters(channel, control, value, status, group);
    script.toggleControl(group, "play");
};

var syncPlayOutputCallback = function (value, group, control) {
    var parameter = engine.getParameter("[Channel1]", "play");
    if (parameter === 1) {
        midi.sendShortMsg(0x90, Pad_Matrix.scene_5[2], Led_Color.blinkGreen);
    } else {
        midi.sendShortMsg(0x90, Pad_Matrix.scene_5[2], Led_Color.off);
    }
};

engine.makeConnection("[Channel1]", "play", syncPlayOutputCallback);

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

// engine.getParameter and engine.setParameter work
// with values on a scale from 0 to 1.
// -------------------------------------------------------
// engine.getParameter(string group, string key);
// engine.setParameter(string group, string key, double newValue);
//
//
// The engine.get/setValue functions should be used for Controls
// with discrete states like orientation.
// -------------------------------------------------------
// engine.getValue(string group, string key);
// engine.setValue(string group, string key, double newValue);
