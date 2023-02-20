var Apckey25 = {};


Apckey25.init = function (id, debugging) {
    print('--->>>', id, debugging);
}

Apckey25.shutdown = function () {

}

Apckey25.teste = function(channel, control, value, status, group) {
    print('channel: ' + channel); // 
    print('control: ' + control); // 
    print('value: ' + value); // sempre 0x7F
    print('status: ' + status); // press or release
    print('group: ' + group);

    // const x = engine.getValue(group, control);
    const y = engine.getParameter(group, 'play');
    print('y: ' + y);
    // const x = engine.getValue('[Channel1]', 'play');
    // print('x: ' + x);
    
    // engine.setValue('[Channel1]', 'play', '1');
}

// engine.getParameter(string group, string key);
// engine.setParameter(string group, string key, double newValue);
// engine.getValue(string group, string key);
// engine.setValue(string group, string key, double newValue);