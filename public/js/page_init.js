(function() {
    
    loaders.navbar($("#top-bar-container"), function(nav_bar) {
	init_navbar(nav_bar);
    });
    

    var login_email = get_all_login_emails();
    
    if (login_email.length > 0) {
	for (var i = 0; i < login_email.length; ++i) {
	    var container = $("<div>");

	    (function(email, controls_container) {
		loaders.user_controls(controls_container, function(controls) {
		    init_user_controls(controls, email);
		});
	    })(login_email[i], container);

	    $("#main-container").append(container);
	}
    } else {
	// TODO: check for a user token cookie instead
	var controls_container = $("<div>");
	var login_container = $("<div>");
	loaders.user_login(login_container, function(first_login) {
	    init_user_login(first_login, controls_container);
	});

	$("#main-container")
	    .append(controls_container)
	    .append(login_container);
    }
})();

