(function() {
    var config_nodes = [];

    // just modifies the database for trigger_alarm to pick up later
    function setup_config_node(soc, alarms) {
	soc.on('add_alarm', function(data) {
	    if (data.time_stamp && data.alarm_name && data.user) {
		alarms.insert({
		    time: data.time_stamp, 
		    name: data.alarm_name,
		    user: data.user
		});

		console.log('alarm added');
	    } else {
		console.log("tried to create alarm without time, name, or user");
		console.log(data);
	    }
	});

	config_nodes.push(soc);
	soc.on('disconnect', function() {
	    console.log('config node disconnected');
	    var index = config_nodes.indexOf(soc);
	    config_nodes.splice(index, 1);
	});

	soc.emit('ready', {});
    }

    module.exports.setup_config_node = setup_config_node;

})();