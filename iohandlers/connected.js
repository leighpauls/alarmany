(function() {

    function handle_connected(soc) {
	soc.on('marco', function() {
	    soc.emit('polo');
	});

	// TODO: set a marco timer with a timeout
	// TODO: inform the other nodes of a disconnect
    }

    module.exports.handle_connected = handle_connected;

})();