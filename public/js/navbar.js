function init_navbar(node) {
    var conn_soc = io.connect('/io_connected');
    var conn_bar_node = node.find('.alm-conn-status');

    conn_soc.on('polo', function() {
	conn_bar_node
	    .addClass('label-success')
	    .removeClass('label-inverted')
	    .text('Connected to Alarmany');
    });

    conn_soc.on('disconnect', function() {
	conn_bar_node
	    .addClass('label-important')
	    .removeClass('label-success')
	    .removeClass('label-inverted')
	    .text('No connection to server');
    });

    conn_soc.on('connect', function() {
	conn_soc.emit('marco');
    });
    

}