(function() {

    var utils = require('../common/utils');
    var crypto = require('crypto');

    function hash_password(password, salt) {
	var hash = crypto.createHash('sha1');
	hash.update(password + salt);
	return hash.digest('hex');
    }

    function user_database(users) {
	return {
	    login_attempt: function(email, password, success_cb, failure_cb) {
		users.findOne({ email: email }, function (err, doc) {
		    if (doc) {
			var password_hash = hash_password(password, doc.salt);

			console.log(password);
			console.log(doc['salt']);
			console.log(doc);
			console.log(password_hash);
			console.log(doc.password_hash);

			if (password_hash !== doc.password_hash) {
			    failure_cb("Incorrect password");
			} else {
			    var new_login_token = utils.rand_int();
			    users.update({ email: email },
					 { $push: {
					     browser_tokens: new_login_token
					 }});
			    
			    succes_cb(new_login_token);
			}
		    } else {
			console.log(err);
			failure_cb("Couldn't find user with email '"
				   + email + "'");

		    }

		});
	    },
	    attempt_sign_up: function(email, password, success_cb, failure_cb) {
		users.findOne({ email: email }, function (err, doc) {
		    if (doc) {
			failure_cb('Already have account registered for that email');
		    } else {
			var salt = utils.rand_int() + "";
			var password_hash = hash_password(password, salt);

			users.insert({
			    email: email,
			    password_hash: password_hash,
			    salt: salt,
			    browser_tokens: [login_token]
			});
			
			on_success(login_token);
		    }
		});
	    }
	};
    }

    module.exports.user_database = user_database;

})();