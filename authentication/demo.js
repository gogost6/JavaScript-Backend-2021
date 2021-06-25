const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

function gen() {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        console.log('salt: ' + salt);
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            console.log('hash: ' + hash);
        });
    });
}

// Load hash from your password DB.
function comp(hash) {
    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result == true
        console.log('result 1: ' + result + ' ' + myPlaintextPassword);
    });
    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        console.log('result 2: ' + result + ' ' + someOtherPlaintextPassword);
    });
}

gen();
comp('$2b$10$f4IO8W.a8SF.YrlPlw90F.AzQs01pazW3poQTeocsOww.7MOK2zri');