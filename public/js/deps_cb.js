// a generator of multi-dependency callbacks
function deps_cb(cb) {
    var enabled = false;
    var deps_left = 0;

    var try_cb = function() {
	if (enabled) {
	    cb();
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
		    deps_left--;
		    if (deps_left === 0) {
			try_cb();
		    }
		} else {
		    throw "Tried to resolve a single dep more than once"
		}
	    }
	},
	enable: function() {
	    if (deps_left === 0) {
		cb(last_args);
	    }
	    enabled = true;
	}
    };
}