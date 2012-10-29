(function() {
    
    loaders.navbar($("#top-bar-container"), function(nav_bar) {
	init_navbar(nav_bar);
    });
    
    // TODO: check for a user token cookie instead
    var controls_container = $("<div>");
    var login_container = $("<div>");
    loaders.user_login(login_container, function(first_login) {
	init_user_login(first_login, controls_container);
    });
    
    $("#main-container")
	.append(controls_container)
	.append(login_container)
    

})();