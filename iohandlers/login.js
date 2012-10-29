(function() {

    function handle_login(soc) {
	console.log('handling logins...');
	soc.on('login-attempt', function(data) {
	    console.log('login attempt...');
	    // TODO: actually approve and authenticate
	    soc.emit('login-accepted', {
		email: data.email
	    });
	});
    }

    module.exports.handle_login = handle_login;

})();