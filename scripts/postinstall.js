// Script to run post installation

const fs = require('fs');
const path = require('path');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_BIN = AWCLI_NI_ROOT + '/bin';

function createIfNonExistant(path) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

createIfNonExistant(AWCLI_NI_BIN);

function saveManifest(toPath) {
    let manifest = {
        name: "io.adaptiveweb.awcli",
        description: "Adaptive Web Command-Line Interface",
        path: AWCLI_NI_BIN + '/awcli-ni.js',
        type: "stdio",
        allowed_origins: [
            "chrome-extension://jcafnpjonokpcijflnimbioahfpgchac/",
            "opensource@adaptiveweb.io"
        ]
    };

    fs.writeFileSync(toPath, JSON.stringify(manifest));
}

function copyExec() {
    let src = path.dirname(__dirname) + '/dist/native_interface/awcli-ni.js';
    let dest = AWCLI_NI_BIN + '/awcli-ni.js';
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0777);
}

saveManifest(AWCLI_NI_BIN + '/manifest.json');
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
    }, function(err) {
        console.error(err);
    });
}

function installMacOS() {
    let locations = [
        // Firefox
        '/Library/Application Support/Mozilla/NativeMessagingHosts/io.adaptiveweb.awcli.json',
        '/Library/Application Support/Mozilla/ManagedStorage/io.adaptiveweb.awcli.json',
        '/Library/Application Support/Mozilla/PKCS11Modules/io.adaptiveweb.awcli.json',
        // Chrome
        '/Library/Google/Chrome/NativeMessagingHosts/io.adaptiveweb.awcli.json',
        // Other Chromium browsers
        '/Library/Application Support/Chromium/NativeMessagingHosts/io.adaptiveweb.awcli.json'
    ];

    locations.forEach(loc => {
        createIfNonExistant(path.dirname(loc));
        saveManifest(loc);
    });
    console.log('Finished! (Installed Native Interfaces for Firefox, Chrome and Chromium on MacOS)');
}

function installLinux() {
    let locations = [
        // Firefox
        '/usr/lib/mozilla/native-messaging-hosts/io.adaptiveweb.awcli.json',
        '/usr/lib/mozilla/managed-storage/io.adaptiveweb.awcli.json',
        '/usr/lib/mozilla/pkcs11-modules/io.adaptiveweb.awcli.json',
        // Chrome
        '/etc/opt/chrome/native-messaging-hosts/io.adaptiveweb.awcli.json',
        // Other Chromium browsers
        '/etc/chromium/native-messaging-hosts/io.adaptiveweb.awcli.json'
    ];

    locations.forEach(loc => {
        createIfNonExistant(path.dirname(loc));
        saveManifest(loc);
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