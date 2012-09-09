
(function() {

    var socket = io.connect();

    socket.on('ready', function() {
	// I can actually do stuff now
	$('#addButton').click( function() {
	    socket.emit('add_alarm', {
		time_stamp: (new Date()).getTime() + 1000,
		alarm_name: "Leigh's demo alarm",
		user: "leigh"
	    });
	});
    });

    // start talking to the server
    socket.emit('identify_type', { 'config_node': true });
    
})();