var Service = require('node-windows').Service;

var svc = new Service({
    name: 'WCC Bot Server',
    description: 'Auto start up server for Windsor Case Count discord bot.',
    script: 'C:\\Users\\Rutu\\OneDrive\\Documents\\Projects\\WindorCaseCount\\index.js'
});

svc.on('install', function () {
    svc.start();
});

svc.install();