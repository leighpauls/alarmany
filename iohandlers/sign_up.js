(function() {

    var utils = require('../common/utils');
    var crypto = require('crypto');

    function handle_sign_up(soc, users) {
	soc.on('user-sign-up-attempt', function(data) {
	    console.log('sign up attempt');
	    console.log(data);
	    // TODO: verify email address is valid
	    if ((!data.password) || data.password.length < 5) {
		soc.emit('user-sign-up-failure', {
		    message: 'Invalid password: Needs to be at least 5 characters'
		});
	    } else {
		users.findOne({ email: data.email }, function (err, doc) {
		    if (doc) {
			soc.emit('user-sign-up-failure', {
			    message: 'Already have account registered for that email'
			});
		    } else {
			var salt = utils.rand_int() + "";
			var login_token = utils.rand_int();
			var hash = crypto.createHash('sha1');
			hash.update(data.password + salt);
			var password_hash = hash.digest('hex');

			users.insert({
			    email: data.email,
			    password_hash: password_hash,
			    salt: salt,
			    browser_tokens: [login_token]
			});
			
			soc.emit('user-sign-up-success', {
			    email: data.email,
			    login_token: login_token
			});
		    }
		});
	    }
	});
    }

    module.exports.handle_sign_up = handle_sign_up;

})();