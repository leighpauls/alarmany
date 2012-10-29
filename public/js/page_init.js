(function() {
    
    var socket = io.connect();

    loaders.navbar($("#top-bar-container"), function(nav_bar) {
	// TODO: set up top bar
    });
    
    // TODO: check for a user token cookie instead
    var login_container = $("<div>");
    loaders.user_login(login_container, function(first_login) {
	init_user_login(first_login, socket);
    });
    $("#main-container")
	.append(login_container)
    

})();