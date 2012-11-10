(function() {
    function handle_time_alarm(soc, alarms) {
	console.log("handling time alarm");
	soc.on('time-alarm-config-attempt-single', function(data) {
	    console.log('time alarm attempt');
	    // TODO: auth token
	    // TODO: verify the data

	    alarms.insert({
		type: 'time-alarm-single',
		fire_time: data.time_stamp,
		name: data.alarm_name,
		user: data.user
	    }, {}, function(err, result) {
		if (err) {
		    soc.emit('time-alarm-single-failure', {
			alarm_id: data.alarm_id
		    });
		} else {
		    soc.emit('time-alarm-single-success', {
			alarm_id: data.alarm_id
		    });
		}
	    });
	});
    }

    module.exports.handle_time_alarm = handle_time_alarm;

})();