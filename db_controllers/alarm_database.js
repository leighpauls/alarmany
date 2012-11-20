(function() {

    function alarm_database(alarms) {
	return {
	    insert_single_alarm: function(user,
					  alarm_name,
					  time_stamp,
					  success_cb,
					  failure_cb) {
		alarms.insert({
		    type: 'time-alarm-single',
		    fire_time: time_stamp,
		    name: alarm_name,
		    user: user
		}, {}, function(err, result) {
		    if (err) {
			console.log(err);
			failure_cb("Failed to add alarm");
		    } else {
			success_cb();
		    }
		});
	    }
	};
    };
    
    module.exports.alarm_database = alarm_database;

})();