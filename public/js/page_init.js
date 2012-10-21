(function() {
    
    loaders.navbar($("#top-bar-container"), function(nav_bar) {
	
    });

    var ctls;
    var lgn;

    var controls_container = $("<div>");
    var login_container = $("<div>");
    var other_login = $("<div>");

    loaders.user_controls(controls_container, function(user_controls) {
	ctls = user_controls;
		
    });

    loaders.user_login(login_container, function(first_login) {
	lgn = first_login;
    });
    loaders.user_login(other_login);
    
    $("#main-container")
	.append(controls_container)
	.append(login_container)
	.append(other_login);


})();