function init_user_login(node, controls_container) {
    var soc = io.connect('/io_login');

    soc.on('login-accepted', function(data) {
	loaders.user_controls(controls_container, function(controls) {
	    init_user_controls(controls, data.email);
	});
	node.css('visibility', 'hidden');
    });

    node.find('.alm-user-login-submit').click(function() {
	soc.emit('login-attempt', {
	    email: node.find('.alm-email-field').val(),
	    pass: node.find('.alm-pass-field').val()
	});
    });
}
