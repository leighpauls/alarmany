// TODO: replace this hack with a real build process
var loaders = {};

(function () {
    g_ctx_name = "ctx";
    function load_widget(url, obj, ctx_name, cb) {
	$.get(url, function(data) {
            last_ctx = g_ctx_name;
            g_ctx_name = g_ctx_name + "__" + ctx_name;

            var fixed_data = $(data.replace(/CTX/g, g_ctx_name));

            obj.append(fixed_data);

            g_ctx_name = last_ctx;

            if (cb) {
		cb(fixed_data);
            }
	});
    }

    var g_next_widget_id = 1;
    function make_loader(widget_class) {
	loaders[widget_class] = function(parent, cb) {
	    var ctx_name = widget_class + '' + g_next_widget_id;
	    g_next_widget_id += 1;
	    load_widget("/p/widgets/" + widget_class + ".html", parent, ctx_name, cb);
	};
    }

    make_loader("alarm_config");
    make_loader("alarm_queue");
    make_loader("nap_config");
    make_loader("navbar");
    make_loader("new_user_button");
    make_loader("time_alarm_config");
    make_loader("user_controls");
    make_loader("user_login");
    make_loader("wake_up_node");

})();