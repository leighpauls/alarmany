function init_user_sign_up(node, open_controls_cb, cancel_sign_up_cb) {
    var soc = io.connect('/io_sign_up');
    soc.on('user-sign-up-success', function(data) {
	if (data.email && data.login_token) {
	    add_login_token(data.email, data.login_token);
	}

	open_controls_cb(data.email);
    });

    soc.on('user-sign-up-failure', function (data) {
	console.log('TODO: handle sign up failure:');
	console.log(data.message);
    });

    node.find('.alm-sign-up-submit-btn').click(function() {
	var email = node.find('.alm-sign-up-email-text').val();
	var pass = node.find('.alm-sign-up-password').val();
	var pass_confirm = node.find('.alm-sign-up-password-confirm').val();
	
	if (email && pass && pass_confirm) {
	    if (pass === pass_confirm) {
		soc.emit('user-sign-up-attempt', {
		    email: email,
		    password: pass
		});
	    } else {
		console.log("TODO: handle un-matching passwords");
	    }
	} else {
	    console.log("TODO: handle bad input to sign up");
	}
    });

    node.find('.alm-sign-up-cancel-btn').click(function() {
	cancel_sign_up_cb();
    });
    
}