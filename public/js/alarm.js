
(function() {

    var socket = io.connect();
    var alarms_sounding = [];

    socket.on('ready', function() {

	socket.on('trigger_alarm', function (data) {
	    if (data.alarm_name && data.alarm_user && data.alarm_time) {
		var alarm_name = data.alarm_name;
		$('#alarmState').text('triggered');
		$('#alarmName').text(alarm_name);
		$('#alarmUser').text(data.alarm_user);
		$('#alarmTime').text(data.alarm_time);
	
		if (alarms_sounding.indexOf(alarm_name) < 0) {
		    alarms_sounding.push(data.alarm_name);
		    $('#alarmsSounding').text(alarms_sounding.join(', '))
		}
		
	    } else {
		console.log("Tried to trigger an alarm without name, user, or time");
	    }
	});

	socket.on('dismiss_alarm', function (data) {
	    if (data.alarm_name && data.alarm_user) {
		var alarm_name = data.alarm_name;
		$('#alarmState').text('dismissed');
		$('#alarmName').text(alarm_name);
		$('#alarmUser').text(data.alarm_user);
		$('#alarmTime').text("");
		
		if (alarms_sounding.indexOf(alarm_name) >= 0) {
		    alarms_sounding.splice(alarms_sounding.indexOf(data.alarm_name), 1);
		    $('#alarmsSounding').text(alarms_sounding.join(', '))
		}
		
	    } else {
		console.log("Tried to dismiss an alarm without name or user");
	    }

	});

	// tell the server I'm here
	socket.emit('attach_to_user', { 'user': 'leigh' });

    })

    socket.emit('identify_type', { 'alarm_node': true });
})();