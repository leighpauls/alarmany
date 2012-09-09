
(function() {

    var socket = io.connect();

    socket.on('ready', function() {
	// I can actually do stuff now
	$('#addButton').click( function() {

	    var secs = parseInt($('#secondOffset').val(), 10);
	    var mins = parseInt($('#minuteOffset').val(), 10);
	    var hours = parseInt($('#hourOffset').val(), 10);
	    

	    socket.emit('add_alarm', {
		time_stamp: (new Date()).getTime()
		    + 1000 * secs
		    + 60 * 1000 * mins
		    + 60 * 60 * 1000 * hours,
		alarm_name: "Leigh's demo alarm",
		user: "leigh"
	    });
	});
    });

    // start talking to the server
    socket.emit('identify_type', { 'config_node': true });
    
})();