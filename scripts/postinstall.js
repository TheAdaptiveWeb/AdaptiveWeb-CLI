// Script to run post installation

const fs = require('fs');
const path = require('path');

const AWCLI_NI_ROOT = process.env.HOME + '/.adaptiveweb/developer';
const AWCLI_NI_BIN = AWCLI_NI_ROOT + '/bin';

function createIfNonExistant(path) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

createIfNonExistant(AWCLI_NI_BIN);

function generateManifest() {
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

    fs.writeFileSync(AWCLI_NI_BIN + '/manifest.json', JSON.stringify(manifest));
}

function copyExec() {
    let src = path.dirname(__dirname) + '/dist/native_interface/awcli-ni.js';
    let dest = AWCLI_NI_BIN + '/awcli-ni.js';
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, 0777);
}

generateManifest();
copyExec();

console.log('postinstall done');