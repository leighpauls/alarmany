(function() {

    $('#infoDiv').text("Waiting for server connection...");

    
    var socket = io.connect();
    
    socket.on('ready', function() {

	socket.on('trigger_node_alarm', function (data) {
	    $('#qrcodeTable').qrcode({
		render: "table",
		text: "elem: " + data.element_id + ', seq: ' + data.sequence_id
	    });
	    $('#infoDiv').text("Waiting for scan");
	});

	socket.on('next_node', function (data) {
	    $('#qrcodeTable').html("");
	    $('#infoDiv').text("go to " + data.node_name);
	});

	socket.on('wrong_node', function (data) {
	    $('#infoDiv').text("Wrong node, go to " + data.node_name);
	});

	$('#infoDiv').text("Waiting for alarm to go off");


	socket.emit('attach_qr_node', {
	    user: 'leigh',
	    node_name: 'leigh macbook air'
	});

    });

    socket.emit('identify_type', { 'qr_node': true });
})();

