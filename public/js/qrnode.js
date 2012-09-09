(function() {

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
	    last_url = window.location.origin 
		+ '/scan/' + data.sequence_id + '/' + data.element_id

	    $('#qrcodeTable').css('display', 'inline');

	    $('#qrcodeTable').qrcode({
		render: "table",
		text: last_url
	    });
	    $('#infoDiv').text("Waiting for scan");
	});

	socket.on('next_node', function (data) {
	    $('#qrcodeTable').css('display', 'none');
	    $('#qrcodeTable').html("");
	    $('#infoDiv').text("go to " + data.node_name);
	    last_url = null;
	});

	socket.on('wrong_node', function (data) {
	    $('#infoDiv').text("Wrong node, go to " + data.node_name);
	});

	socket.on('alarm_done', function () {
	    $('#qrcodeTable').css('display', 'none');
	    $('#infoDiv').text("Waiting for alarm to go off");
	});

	$('#infoDiv').text("Waiting for alarm to go off");


	socket.emit('attach_qr_node', {
	    user: 'leigh',
	    node_name: 'leigh macbook air'
	});

    });

    socket.emit('identify_type', { 'qr_node': true });
})();

