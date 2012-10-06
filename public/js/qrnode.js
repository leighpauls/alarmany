(function() {

    // see if there's a hash, and use that as my name
    var hash = window.location.hash;
    var node_name = "unnamed node";
    if (hash && hash.length > 0) {
	node_name = hash.substring(1);
    }

    $('#infoDiv').text("Waiting for server connection...");

    var socket = io.connect();
    var last_url = null;

    $('#getUrlBtn').click(function() {
	if (last_url) {
	    $.get(last_url);
	}
    });
    
    socket.on('ready', function() {

	socket.on('trigger_node_alarm', function (data) {
	    last_url = window.location.protocol + '//' + window.location.host
		+ '/scan/' + data.sequence_id + '/' + data.element_id
	});

	socket.on('next_node', function (data) {
	    last_url = null;
	});

	socket.on('new_dest', function(data) {
	    if (node_name === data.node_name) {
		$('#infoDiv').text("Hit this button!");
	    } else {
		$('#infoDiv').text("Go to " + data.node_name);
	    }
	});
	    

	socket.on('wrong_node', function (data) {
	    $('#infoDiv').text("Wrong node, go to " + data.node_name);
	});

	socket.on('alarm_done', function () {
	    $('#infoDiv').text("Alarm is deactivated");
	});

	$('#infoDiv').text("Waiting for alarm to sound");


	socket.emit('attach_qr_node', {
	    user: 'leigh',
	    node_name: node_name
	});
    });

    socket.emit('identify_type', { 'qr_node': true });
})();

