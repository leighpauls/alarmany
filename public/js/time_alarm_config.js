function time_alarm_config_loader(node, instance_cd) {
    var random_radio_name = 'radio_group_' + Math.random();
    node.find('.alm-time-alarm-radio').attr('name', random_radio_name);
}