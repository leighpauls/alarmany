function init_user_controls(node, email) {
    node.find('.alm-email-space').text(email);
}

function user_controls_loader(node, instance_cb) {
    var deps = deps_cb(function() { instance_cb(node); });
    loaders.wake_up_node(node.find(".alm-wake-up-node-cont"), deps.add_dep());
    loaders.alarm_config(node.find(".alm-alarm-config-cont"), deps.add_dep());
    loaders.alarm_queue(node.find(".alm-alarm-queue-cont"), deps.add_dep());

    deps.enable();
}
