// Script to run post installation

const fs = require('fs');
const path = require('path');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_BIN = AWCLI_NI_ROOT + '/bin';

const bash = `#!/bin/bash
echo hello
node ./awcli-ni.js`;

function createIfNonExistant(path) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

createIfNonExistant(AWCLI_NI_BIN);

function saveManifest(toPath, origins) {
    let manifest = {
        name: "io.adaptiveweb.awcli",
        description: "Adaptive Web Command-Line Interface",
        path: AWCLI_NI_BIN + '/ni.sh',
        type: "stdio",
        allowed_origins: origins
    };

    fs.writeFileSync(toPath, JSON.stringify(manifest));
}

function copyExec() {
    let src = path.dirname(__dirname) + '/dist/native_interface/awcli-ni.js';
    let dest = AWCLI_NI_BIN + '/awcli-ni.js';
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0777);

    fs.writeFileSync(path.dirname(dest) + '/ni.sh', bash);
    fs.chmodSync(path.dirname(dest) + '/ni.sh', 0777);
}

saveManifest(AWCLI_NI_BIN + '/manifest.json', [ 'opensource@adaptiveweb.io', 'chrome-extension://jcafnpjonokpcijflnimbioahfpgchac/' ]);
copyExec();

console.log('native interface compiled to ~/.adaptiveweb, linking...');

function installWindows() {
    const regedit = require('regedit');
    regedit.putValue({
        // Firefox
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\Mozilla\\NativeMessagingHosts\\io.adaptiveweb.awcli': AWCLI_NI_BIN + '/manifest.json',
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\Mozilla\\ManagedStorage\\io.adaptiveweb.awcli': AWCLI_NI_BIN + '/manifest.json',
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\Mozilla\\PKCS11Modules\\io.adaptiveweb.awcli': AWCLI_NI_BIN + '/manifest.json',
        // Chrome
        'HKEY_CURRENT_USER\\Software\\Google\\Chrome\\NativeMessagingHosts\\io.adaptiveweb.awcli': AWCLI_NI_BIN + '/manifest.json',
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\Google\\Chrome\\NativeMessagingHosts': AWCLI_NI_BIN + '/manifest.json',
    }, function(err) {
        console.error(err);
    });
}

function installMacOS() {
    let locations = [
        // Firefox
        { origins: [ 'opensource@adaptiveweb.io' ], locs: [
            '/Library/Application Support/Mozilla/NativeMessagingHosts/io.adaptiveweb.awcli.json',
            '/Library/Application Support/Mozilla/ManagedStorage/io.adaptiveweb.awcli.json',
            '/Library/Application Support/Mozilla/PKCS11Modules/io.adaptiveweb.awcli.json',
        ] },
        // Chrome
        { origins: [ 'chrome-extension://jcafnpjonokpcijflnimbioahfpgchac/' ], locs: [
            '/Library/Google/Chrome/NativeMessagingHosts/io.adaptiveweb.awcli.json',
            '~/Library/Application Support/Google/Chrome/NativeMessagingHosts/io.adaptiveweb.awcli.json',
        ] },
        // Other Chromium browsers
        { origins: [ ], locs: [
            '/Library/Application Support/Chromium/NativeMessagingHosts/io.adaptiveweb.awcli.json',
            '~/Library/Application Support/Chromium/NativeMessagingHosts/io.adaptiveweb.awcli.json'
        ] },
    ];

    locations.forEach(loc => {
        loc.locs.forEach(l => {
            createIfNonExistant(path.dirname(l));
            saveManifest(l, loc.origins);
        });
    });
    console.log('Finished! (Installed Native Interfaces for Firefox, Chrome and Chromium on MacOS)');
}

function installLinux() {
    let locations = [
        // Firefox
        { origins: [ 'opensource@adaptiveweb.io' ], locs: [
            '/usr/lib/mozilla/native-messaging-hosts/io.adaptiveweb.awcli.json',
            '/usr/lib/mozilla/managed-storage/io.adaptiveweb.awcli.json',
            '/usr/lib/mozilla/pkcs11-modules/io.adaptiveweb.awcli.json',
        ] },
        // Chrome
        { origins: [ 'chrome-extension://jcafnpjonokpcijflnimbioahfpgchac/' ], locs: [
            '/etc/opt/chrome/native-messaging-hosts/io.adaptiveweb.awcli.json',
            '~/.config/google-chrome/NativeMessagingHosts/io.adaptiveweb.awcli.json',
        ] },
        // Other Chromium browsers
        { origins: [ /* TODO */ ], locs: [
            '/etc/chromium/native-messaging-hosts/io.adaptiveweb.awcli.json',
            '~/.config/chromium/NativeMessagingHosts/io.adaptiveweb.awcli.json'
        ] }
    ];

    locations.forEach(loc => {
        loc.locs.forEach(l => {
            createIfNonExistant(path.dirname(l));
            saveManifest(l, loc.origins);
        });
    });
    console.log('Finished! (Installed Native Interfaces for Firefox, Chrome and Chromium on Linux)');
}

switch(process.platform) {
    case 'darwin': // MacOS
    installMacOS();
    break;
    case 'win32': // Windows
    installWindows();
    break;
    default: // Assume Linux
    installLinux();
}