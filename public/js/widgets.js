// TODO: replace this hack with a real build process
var loaders = {};

(function () {
    var g_next_widget_id = 1;
    function make_loader(widget_class, widget_cb) {
	loaders[widget_class] = function(parent, instance_cb) {
	    $.get("/p/widgets/" + widget_class + ".html", function(data) {
		var new_node = $(data);

		parent.append(new_node);

		if (widget_cb) {
		    widget_cb(new_node, instance_cb);
		} else if (instance_cb) {
		    instance_cb(new_node);
		}
	    });
	};
    }

    make_loader("alarm_config", alarm_config_loader);
    make_loader("alarm_queue");
    make_loader("nap_config");
    make_loader("navbar");
    make_loader("new_user_button");
    make_loader("time_alarm_config");
    make_loader("user_controls", user_controls_loader);
    make_loader("user_login");
    make_loader("wake_up_node");

})();