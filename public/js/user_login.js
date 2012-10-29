function init_user_login(node) {
    var soc = io.connect('/iologin');
    node.find('.user_login_submit').click(function() {
	
	soc.emit('login-attempt', {
	    email: node.find('.email_field').val(),
	    pass: node.find('.pass_field').val()
	});
	    
    });
}