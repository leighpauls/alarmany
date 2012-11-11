(function() {

    var utils = require('../common/utils');
    var crypto = require('crypto');
    
    function handle_login(soc, users) {
	console.log('handling logins...');
	soc.on('login-attempt', function(data) {
	    console.log('login attempt...');

	    users.findOne({ email: data.email }, function (err, doc) {
		if (doc) {
		    var hash = crypto.createHash('sha1');
		    hash.update(data.password + doc.salt);
		    var password_hash = hash.digest('hex');

		    console.log(data.password);
		    console.log(doc['salt']);
		    console.log(doc);
		    console.log(password_hash);
		    console.log(doc.password_hash);

		    if (password_hash !== doc.password_hash) {
			soc.emit('login-failed', {
			    message: "Incorrect password"
			});
		    } else {
			var new_login_token = utils.rand_int();
			users.update({ email: data.email },
				     { $push: {
					 browser_tokens: new_login_token
				     }});
			
			soc.emit('login-accepted', {
			    email: data.email,
			    login_token: new_login_token
			});
		    }
		} else {
		    console.log(err);
		    soc.emit('login-failed', {
			message: "Couldn't find user with email '" + data.email + "'"
		    });
		}

	    });
	});
    }

    module.exports.handle_login = handle_login;

})();