function alarm_config_loader(node, instance_cb) {
    var deps = deps_cb(function() {
	instance_cb(node);
    });

    loaders.time_alarm_config(
	node.find(".alm-time-alarm-config-cont"),
	deps.add_dep());

    loaders.nap_config(
	node.find(".alm-nap-config-cont"),
	deps.add_dep());

    deps.enable();

}

function init_alarm_config(node, user_email) {
    var config_buttons = node.find('.alm-config-buttons');
    var time_alarm_config = node.find('.alm-time-alarm-config').hide();
    var nap_alarm_config = node.find('.alm-nap-alarm-config').hide();

    config_buttons.find('.alm-time-alarm-button').click(function() {
	config_buttons.hide();
	time_alarm_config.show();
    });
    config_buttons.find('.alm-nap-alarm-button').click(function() {
	config_buttons.hide();
	nap_alarm_config.show();
    });

    init_time_alarm_config(
	time_alarm_config,
	user_email,
	function() {
	    time_alarm_config.hide();
	    config_buttons.show();
	});
}