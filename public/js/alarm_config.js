function alarm_config_loader(node, instance_cb) {
    var deps = deps_cb(function() {
	instance_cb(node);
    });

    var time_config = node.find(".alm-time-alarm-config-cont")
	.css('display', 'none');
    loaders.time_alarm_config(time_config, deps.add_dep());

    var nap_config = node.find(".alm-nap-config-cont")
	.css('display', 'none');
    loaders.nap_config(nap_config, deps.add_dep());

    deps.enable();

    var config_buttons = node.find('.alm-config-buttons');
    node.find('.alm-time-alarm-button').click(function() {
	config_buttons.css('display', 'none');
	time_config.css('display', 'inline');
    });
    node.find('.alm-nap-alarm-button').click(function() {
	config_buttons.css('display', 'none');
	nap_config.css('display', 'inline');
    });
}
