(function() {

    var user_alarms = {};
    var active_users = [];

    function dismiss_user_alarms(user, name) {
	console.log('alarm list:');
	console.log(user_alarms);
	var alarm_list = user_alarms[user];
	if (!alarm_list) {
	    console.log('trying to dismiss alarms for a user with no alarms, user: ' + user);
	    return;
	}
	for (var i = 0; i < alarm_list.length; ++i) {
	    alarm_list[i].emit('dismiss_alarm', {
		alarm_name: name,
		alarm_user: user
	    });
	}
    }

    function config_trigger_alarm(alarms, qr_trigger) {
	console.log('initing trigger cron');
	var CronJob = require('cron').CronJob;
	new CronJob('* * * * * *', function(){
	    var time = (new Date()).getTime();
	    var stream = alarms.find({ time: { $lte: time } }).streamRecords();

	    stream.on('data', function(item) {
		console.log('found alarm to fire');
		var alarm_sockets = user_alarms[item.user];

		console.log('delete the alarm');
		alarms.remove(item);
		if (!alarm_sockets) {
		    return;
		}
		
		// trigger each of the users alarms
		for (var i = 0; i < alarm_sockets.length; ++i) {
		    alarm_sockets[i].emit('trigger_alarm', {
			alarm_name: item.name,
			alarm_time: item.time,
			alarm_user: item.user
		    });		    
		}

		qr_trigger(item.user, item.name);
	    });
	    stream.on('end', function() {});

	}, null, true);
    }


    function add_alarm_connection(soc) {
	soc.on('attach_to_user', function (data) {
	    var user = data.user;
	    if (!user) {
		console.log('tried to attach alarm to null user');
		return;
	    }
	    if (!(user in active_users)) {
		active_users.push(user);
		user_alarms[user] = [];
	    }
	    user_alarms[user].push(soc);
	    console.log("added alarm for " + user);

	    soc.on('disconnect', function() {
		console.log("alarm dc'd");
		var my_alarms = user_alarms[user];
		if (!my_alarms) {
		    return;
		}
		my_alarms.splice(my_alarms.indexOf(soc), 1);
		if (my_alarms.length == 0) {
		    console.log("user " + user + " has no more alarms");
		    //remove the user
		    active_users.splice(active_users.indexOf(user), 1);
		    user_alarms[user] = null;
		}
	    });
	});

	soc.emit('ready', {});
    }

    module.exports.dismiss_user_alarms = dismiss_user_alarms;
    module.exports.config_trigger_alarm = config_trigger_alarm;
    module.exports.add_alarm_connection = add_alarm_connection;
    
})();