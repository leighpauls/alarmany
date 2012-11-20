function time_alarm_config_loader(node, instance_cb) {
    var random_radio_name = 'radio_group_' + rand_int();
    node.find('.alm-time-alarm-radio').attr('name', random_radio_name);
    
    instance_cb(node);
}

function get_today_tomorrow_timestamp(hour, minute, am_pm) {
    hour = hour % 12;
    if (am_pm == 'PM') {
	hour += 12;
    }
    var cur_time = new Date();
    
    var roll_around = false;
    if (hour < cur_time.getHours()) {
	roll_around = true;
    } else if (hour == cur_time.getHours()) {
	if (minute < cut_time.getMinutes()) {
	    roll_around = true;
	}
    }

    cur_time.setHours(hour);
    cur_time.setMinutes(minute);

    var timestamp = cur_time.getTime();
    if (roll_around) {
	timestamp += 24 * 60 * 60 * 1000;
    }
    return timestamp;
}

function init_time_alarm_config(node, user_email, hide_window_cb) {
    // TODO: login token
    var soc = io.connect('/io_time_alarm');
    var alarm_id = rand_int();
    var login_token = find_login_token(user_email);
    
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

	if (isNaN(hour) || isNaN(minute)) {
	    console.log("TODO: hour/minute NaN");
	    return;
	}

	if (node.find('.alm-today-tomorrow-radio').attr('checked')) {
	    soc.emit('time-alarm-config-attempt-single', {
		type: 'time-alarm-single',
		// TODO: actually calculate this
		fire_time: get_today_tomorrow_timestamp(hour, minute, am_pm),
		// TODO: add a name feature
		name: 'Some Single Shot Alarm',
		user: user_email,
		alarm_id: alarm_id,
		login_token: login_token
	    });
	}
    });

    node.find('.alm-config-cancel-btn').click(function() {
	hide_window_cb();
    });
}