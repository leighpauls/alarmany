// a generator of multi-dependency callbacks
function deps_cb(cb) {
    if (!cb) {
	return { add_dep: function() {}, enable: function() {} };
    }

    var enabled = false;
    var deps_left = 0;
    var last_args = [];

    function try_cb() {
	if (enabled) {
	    cb.apply(arguments);
	} else {
	    last_args = arguments;
	}
    }

    return {
	add_dep: function() {
	    var self_resolved = false;
	    ++deps_left;
	    if (enabled) {
		throw "Tried to add a dep while enabled";
	    }
	    return function() {
		if (!self_resolved) {
		    self_resolved = true;
		    --deps_left;
		    if (deps_left === 0) {
			try_cb.apply(null, arguments);
		    }
		} else {
		    throw "Tried to resolve a single dep more than once"
		}
	    }
	},
	enable: function() {
	    enabled = true;
	    if (deps_left === 0) {
		cb(last_args);
	    }
	}
    };
}