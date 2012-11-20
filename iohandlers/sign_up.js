(function() {

    function handle_sign_up(soc, user_database) {
	soc.on('user-sign-up-attempt', function(data) {
	    console.log('sign up attempt');
	    console.log(data);
	    // TODO: verify email address is valid
	    if ((!data.password) || data.password.length < 5) {
		soc.emit('user-sign-up-failure', {
		    message: 'Invalid password: Needs to be at least 5 characters'
		});
	    } else {

		var on_success = function(login_token) {
		    soc.emit('user-sign-up-success', {
			email: data.email,
			login_token: login_token
		    });
		};

		var on_failure = function(err) {
		    soc.emit('user-sign-up-failure', {
			message: err
		    });
		    
		};

		user_database.attempt_sign_up(
		    data.email, data.password,
		    on_success, on_failure
		);

		
	    }
	});
    }

    module.exports.handle_sign_up = handle_sign_up;

})();