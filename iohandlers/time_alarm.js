(function() {
    function handle_time_alarm(soc, alarm_database, user_database) {
	console.log("handling time alarm");
	soc.on('time-alarm-config-attempt-single', function(data) {
	    console.log('time alarm attempt');
	    // TODO: verify the data

	    var on_success = function() {
		soc.emit('time-alarm-single-success', {
		    alarm_id: data.alarm_id
		});
	    };
	    var on_failure = function(err) {
		soc.emit('time-alarm-single-failure', {
		    alarm_id: data.alarm_id,
		    message: err
		});
	    };

	    user_database.verify_login_token(
		data.user,
		data.login_token,
		function() {
		    alarm_database.insert_single_alarm(
			data.user, 
			data.alarm_name,
			data.fire_time,
			on_success,
			on_failure
		    );
		},
		on_failure
	    );
	});
    }

    module.exports.handle_time_alarm = handle_time_alarm;

})();