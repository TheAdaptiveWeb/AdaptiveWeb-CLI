const rl = require('readline');

const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask() {
    let yes = [ 'y', 'yes', 'ye' ];
    let no = [ 'n', 'no' ];

    r.question('Would you like to install the browser testing tools? (requires sudo): (Y/n) ', (ans) => {
        r.close();
        ans = ans.toLowerCase();
        if (yes.indexOf(ans) !== -1) { process.exit(0); return; }
        if (no.indexOf(ans) !== -1) { 
            console.log('Skipping browser testing tools. Install at any time by running `npm explore awcli -- npm run postinstall`.')
            process.exit(1); 
            return; 
        }
        console.log('Could not interpret response "' + ans + '".');
        ask();
    });
}

ask();