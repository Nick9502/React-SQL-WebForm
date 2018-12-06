var crypto = require('crypto');
const bcrypt = require('bcryptjs');
const hrtime = require('browser-process-hrtime')

const saltRounds = 10;
const plaintext = 'testPassword';
const plaintext2 = 'testPassword2';

function bcryptExecute(plaintext,salt) {
    bcrypt.hash(plaintext, salt).then(function(hash) {
        testPerformance();
        return hash;
    } 
    )}

/**
 * Calculates the MD5 hash of a string.
 *
 * @param  {String} string - The string (or buffer).
 * @return {String}        - The MD5 hash.
 */
function md5(string) {
    var hashMd5 = crypto.createHash('md5').update(string).digest('hex');
    //testPerformance();
    return hashMd5;
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    testPerformance();
	console.log('Using SHA-512 to hash Plaintext...')
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
	console.log('nSalt = '+passwordData.salt);
}

/* Test Performance of a given process */
var testPerformance = () => {
    var start = new Date()
    var hrstart = hrtime()
    var end = new Date() - start,
    hrend = hrtime(hrstart)
    console.info('Execution time: %dms', end)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return (hrend[0] + (hrend[1] / 1000000))
}
var testLocalPerformance = (start,hrstart) => {
    var end = new Date() - start,
    hrend = hrtime(hrstart)
    console.info('Execution time: %dms', end)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return (hrend[1] / 1000000)
}

module.exports = {
    testPerformance,
    testLocalPerformance,
    saltHashPassword,
    sha512,
    md5,
    bcryptExecute,
    genRandomString
}

