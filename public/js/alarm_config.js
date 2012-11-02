function alarm_config_loader(node, instance_cb) {
    var deps = deps_cb(function() { instance_cb(node); });

    loaders.nap_config(node.find(".alm-nap-config-cont"), deps.add_dep());
    loaders.time_alarm_config(node.find(".alm-time-alarm-config-cont"),
			      deps.add_dep());

    deps.enable();
}
