function user_login_loader(node, instance_cb) {
    loaders.user_sign_up(node.find(".alm-user-sign-up-cont"), function() {
	instance_cb(node);
    });
}

function init_user_login(node, controls_container) {
    var soc = io.connect('/io_login');

    var open_controls_cb = function(email) {
	loaders.user_controls(controls_container, function(controls) {
	    init_user_controls(controls, email);
	});
	node.css('visibility', 'hidden');
    };	

    soc.on('login-accepted', function(data) {
	open_controls_cb(data.email);
    });

    soc.on('login-failed', function(data) {
	console.log('TODO: handle login failure:');
	console.log(data.message);
    });

    var user_sign_up_node = node.find('.alm-user-sign-up').hide();
    var normal_login = node.find('.alm-normal-login');

    var cancel_sign_up_cb = function() {
	user_sign_up_node.hide();
	normal_login.show();
    };

    init_user_sign_up(user_sign_up_node, open_controls_cb, cancel_sign_up_cb);

    node.find('.alm-user-sign-up-btn').click(function() {
	normal_login.hide();
	user_sign_up_node.show();
    });

    node.find('.alm-user-login-submit-btn').click(function() {
	soc.emit('login-attempt', {
	    email: node.find('.alm-email-field').val(),
	    password: node.find('.alm-pass-field').val()
	});
    });
}
