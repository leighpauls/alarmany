(function() {
    
    function handle_login(soc, user_database) {
	console.log('handling logins...');
	soc.on('login-attempt', function(data) {
	    console.log('login attempt...');

	    var on_success = function(new_login_token) {
		soc.emit('login-accepted', {
		    email: data.email,
		    login_token: new_login_token
		});
	    };

	    var on_failure = function(err) {
		soc.emit('login-failed', {
		    message: err
		});
	    };

	    user_database.login_attempt(
		data.email,
		data.password,
		on_success,
		on_failure
	    );

	});
    }

    module.exports.handle_login = handle_login;

})();