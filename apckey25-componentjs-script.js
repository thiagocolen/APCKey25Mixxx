// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

// Declare the variable for your controller and assign it to an empty object
var ApcKey25 = {};

ApcKey25.init = function (id, debugging) {
    print("----->>> init()");
    print("----->>> id:" + id + " debugging:" + debugging);

    ApcKey25.initSoftTakeover();
};

ApcKey25.shutdown = function () {
    // send whatever MIDI messages you need to turn off the lights of your controller
};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// UTILS $ CONSTANTS
// -------------------------------------------------------------------------------

// TODO: remove this shit or make it better
ApcKey25.printParameters = function (channel, control, value, status, group) {
    print("------>>> channel:" + channel);
    print("------>>> control:" + control);
    print("------>>> value:" + value);
    print("------>>> status:" + status);
    print("------>>> group:" + group);
};

ApcKey25.initSoftTakeover = function () {
    for (i = 48; i <= 55; i++) {
        engine.softTakeover(
            KNOBS_TO_CONTROL[i].group(1),
            KNOBS_TO_CONTROL[i].control,
            true
        );
        engine.softTakeover(
            KNOBS_TO_CONTROL[i].group(2),
            KNOBS_TO_CONTROL[i].control,
            true
        );
    }
};

ApcKey25.initSoftTakeoverIgnore = function () {
    for (i = 48; i <= 55; i++) {
        engine.softTakeoverIgnoreNextValue(
            KNOBS_TO_CONTROL[i].group(1),
            KNOBS_TO_CONTROL[i].control
        );
        engine.softTakeoverIgnoreNextValue(
            KNOBS_TO_CONTROL[i].group(2),
            KNOBS_TO_CONTROL[i].control
        );
    }
};

// -------------------------------------------------------------------------------

LED_COLOR = {
    off: 0x00,
    green: 0x01,
    blinkGreen: 0x02,
    red: 0x03,
    blinkRed: 0x04,
    yellow: 0x05,
    blinkYellow: 0x06,
};

// TODO: complete the keys of PAD_MATRIX

PAD_MATRIX = {
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
        3: 0x1a,
        4: 0x1b,
        5: 0x1c,
        6: 0x1d,
        7: 0x1e,
        8: 0x1f,
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
        3: 0x0a,
        4: 0x0b,
        5: 0x0c,
        6: 0x0d,
        7: 0x0e,
        8: 0x0f,
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

// TODO: Which keys can we map to a JS Object?

MIDI_VALUES = {
    note_off: 0x80,
    note_on: 0x90,
    control: 0xb0,
    pitch: 0xe0,
};

var KNOBS_TO_CONTROL = {
    48: {
        group: function (n) {
            return "[Channel" + n + "]";
        },
        control: "volume",
    },
    49: {
        group: function (n) {
            return "[Channel" + n + "]";
        },
        control: "filterHigh",
    },
    50: {
        group: function (n) {
            return "[Channel" + n + "]";
        },
        control: "filterMid",
    },
    51: {
        group: function (n) {
            return "[Channel" + n + "]";
        },
        control: "filterLow",
    },
    52: {
        group: function (n) {
            return "[QuickEffectRack1_[Channel" + n + "]]";
        },
        control: "super1",
    },
    53: {
        group: function (n) {
            return "[EffectRack1_EffectUnit" + n + "_Effect1]";
        },
        control: "meta",
    },
    54: {
        group: function (n) {
            return "[EffectRack1_EffectUnit" + n + "_Effect2]";
        },
        control: "meta",
    },
    55: {
        group: function (n) {
            return "[EffectRack1_EffectUnit" + n + "_Effect3]";
        },
        control: "meta",
    },
};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

ApcKey25.isShiftPress = false;

ApcKey25.Shift = function (channel, control, value, status, group) {
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
    script.toggleControl(group, "play");
};

var syncPlayOutputCallback = function (value, group, control) {
    var parameter = engine.getParameter("[Channel1]", "play");

    midi.sendShortMsg(
        MIDI_VALUES.note_on,
        PAD_MATRIX.scene_5[2],
        parameter === 1 ? LED_COLOR.blinkGreen : LED_COLOR.off
    );
};

engine.makeConnection("[Channel1]", "play", syncPlayOutputCallback);

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

ApcKey25.activeDeckObj = {
    name: "Deck1",
    control: "enabled",
    group: "[Master]",
};

ApcKey25.changeActiveDeck = function (channel, control, value, status, group) {
    var parameter = engine.getParameter(
        ApcKey25.activeDeckObj.group,
        ApcKey25.activeDeckObj.control
    );

    ApcKey25.activeDeckObj.name = parameter === 1 ? "Deck1" : "Deck2";

    engine.setParameter(
        ApcKey25.activeDeckObj.group,
        ApcKey25.activeDeckObj.control,
        parameter === 1 ? 0 : 1
    );

    ApcKey25.initSoftTakeoverIgnore();
};

var syncActiveDeckOutputCallback = function (value, group, control) {
    var parameter = engine.getParameter(
        ApcKey25.activeDeckObj.group,
        ApcKey25.activeDeckObj.control
    );

    midi.sendShortMsg(
        MIDI_VALUES.note_on,
        PAD_MATRIX.scene_5[3],
        parameter === 1 ? LED_COLOR.off : LED_COLOR.red
    );

    midi.sendShortMsg(
        MIDI_VALUES.note_on,
        PAD_MATRIX.scene_5[7],
        parameter === 1 ? LED_COLOR.red : LED_COLOR.off
    );
};

engine.makeConnection(
    ApcKey25.activeDeckObj.group,
    ApcKey25.activeDeckObj.control,
    syncActiveDeckOutputCallback
);

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

ApcKey25.knob = function (channel, control, value, status, group) {
    ApcKey25.printParameters(channel, control, value, status, group);

    engine.setValue(
        KNOBS_TO_CONTROL[control].group(
            ApcKey25.activeDeckObj.name === "Deck1" ? "1" : "2"
        ),
        KNOBS_TO_CONTROL[control].control,
        script.absoluteLin(value, 0, 2)
    );
};

ApcKey25.filterKnob = function (channel, control, value, status, group) {
    ApcKey25.printParameters(channel, control, value, status, group);

    engine.setValue(
        KNOBS_TO_CONTROL[control].group(
            ApcKey25.activeDeckObj.name === "Deck1" ? "1" : "2"
        ),
        KNOBS_TO_CONTROL[control].control,
        script.absoluteLin(value, 0, 1)
    );
};

// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------
