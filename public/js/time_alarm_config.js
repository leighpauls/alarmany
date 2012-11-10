function time_alarm_config_loader(node, instance_cb) {
    var random_radio_name = 'radio_group_' + Math.random();
    node.find('.alm-time-alarm-radio').attr('name', random_radio_name);
    
    instance_cb(node);
}

function init_time_alarm_config(node, user_email, hide_window_cb) {
    // TODO: login token
    var soc = io.connect('/io_time_alarm');
    var alarm_id = Math.random();
    
    soc.on('time-alarm-single-failure', function(data) {
	if (data.alarm_id === alarm_id) {
	    console.log('TODO: handle failure alarm case: ' + alarm_id);
	    hide_window_cb();
	}
    });

    soc.on('time-alarm-single-success', function(data) {
	if (data.alarm_id === alarm_id) {
	    console.log('alarm added');
	    hide_window_cb();
	}
    });

    node.find('.alm-config-submit-btn').click(function() {
	var hour = parseInt(node.find('.alm-time-hour').val());
	var minute = parseInt(node.find('.alm-time-minute').val());
	var am_pm = node.find('.alm-am-pm-type').val();
	if (node.find('.alm-today-tomorrow-radio').attr('checked')) {
	    soc.emit('time-alarm-config-attempt-single', {
		type: 'time-alarm-single',
		// TODO: actually calculate this
		fire_time: 0,
		// TODO: add a name feature
		name: 'Some Single Shot Alarm',
		user: user_email,
		alarm_id: alarm_id
		// TODO: auth token
	    });
	}
    });

    node.find('.alm-config-cancel-btn').click(function() {
	hide_window_cb();
    });
}