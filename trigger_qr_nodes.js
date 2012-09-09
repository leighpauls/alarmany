(function() {

    // TODO: get user's first node to the user!!!
    
    var user_qr_nodes = {};
    var active_users = [];

    var active_sequences = {};

    var dismiss_user_func = null

    function config_trigger_qr_nodes(dismiss_user_cb) {
	dismiss_user_func = dismiss_user_cb;
    }

    function end_sequence(sequence_id) {
	var seq = active_sequences[sequence_id];
	console.log('ending sequence');
	if (!seq) {
	    console.log('trying to end a non-active sequence');
	    return;
	}
	// tell the nodes they're done
	for (var i = 0; i < seq.elements.length; ++i) {
	    if (seq.elements[i].connected) {
		seq.elements[i].soc.emit('alarm_done');
	    }
	}
	// stop the alarms
	dismiss_user_func(seq.user, seq.name);
    }

    function send_dest_to_nodes(node_list, dest_name) {
	for (var i = 0; i < node_list.length; ++i) {
	    if (node_list[i].connected) {
		node_list[i].soc.emit('new_dest', {
		    node_name: dest_name
		});
	    }
	}
    }

    function attempt_qr_scan(sequence_id, element_id) {
	var seq = active_sequences[sequence_id];
	if (!seq) {
	    console.log('trying to scan from a non-existance sequence');
	}
	var next_node;
	for (next_node = seq.cur_node + 1; next_node < seq.elements.length; ++next_node) {
	    if (seq.elements[next_node].connected) {
		break;
	    }
	}
	console.log('next node is #' + next_node);
	console.log('len is ' + seq.elements.length);
	if (seq.elements[seq.cur_node].element_id === element_id) {
	    if (seq.elements.length === next_node) {
		end_sequence(sequence_id);
	    } else {
		// tell the user where to go next
		send_dest_to_nodes(seq.elements, seq.elements[next_node].name);
		seq.elements[seq.cur_node].soc.emit('next_node', {});
	    }
	    // remove the disconnect listener
	    seq.elements[seq.cur_node].soc.removeListener('disconnect', seq.elements[seq.cur_node].disc_function);
	    // go to the next node
	    seq.cur_node = next_node;
	} else {
	    // at the wrong node
	    // find the node I'm at
	    for (var i = 0; i < seq.elements.length; ++i) {
		if (element_id === seq.elements[i].cur_node) {
		    seq.elements[i].soc.emit('wrong_node', {
			node_name: seq.elements[seq.cur_node].name
		    });
		}
	    }
	}
    }

    function trigger_qr_nodes(alarm_user, alarm_name) {
	
	var my_qr_nodes = user_qr_nodes[alarm_user];
	if (!my_qr_nodes) {
	    console.log('tried to trigger alarm for user with no nodes');
	    dismiss_user_func(alarm_user, alarm_name);
	    return;
	}
	
	var sequence_id = Math.floor(Math.random() * 1000);
	var new_sequence = [];
	active_sequences[sequence_id] = {
	    elements: new_sequence,
	    sequence_id: sequence_id,
	    user: alarm_user,
	    name: alarm_name,
	    cur_node: 0
	};

	console.log('number of qr nodes to push: ' + my_qr_nodes.length);

	// add the sequence entries
	for (var i = 0; i < my_qr_nodes.length; ++i) {
	    var element_id = Math.floor(Math.random() * 1000);
	    var curSoc = my_qr_nodes[i].socket;
	    var curName = my_qr_nodes[i].node_name;
	    
	    var disc_function = (function (seq, seq_id, idx) {
		return function() {
		    console.log('qr node disconnected');
		    seq[idx].connected = false;
		    seq.splice(idx, 1);
		    if (seq.length === 0) {
			// stop the alarm
			end_sequence(seq_id);
		    }
		}
	    })(new_sequence, sequence_id, i);

	    curSoc.on('disconnect', disc_function);

	    new_sequence.push({
		soc: curSoc,
		name: curName,
		element_id: element_id,
		disc_function: disc_function,
		connected: true
	    });

	    curSoc.emit('trigger_node_alarm', {
		element_id: element_id,
		sequence_id: sequence_id
	    });
	}

	// shuffle the nodes
	for (var i = 0; i < new_sequence.length; ++i) {
	    var j = Math.floor(Math.random() * new_sequence.length);
	    var temp = new_sequence[j];
	    new_sequence[j] = new_sequence[i];
	    new_sequence[i] = temp;
	}

	send_dest_to_nodes(new_sequence, new_sequence[0].name);
    }

    function add_qr_node_connection(soc) {
	
	soc.on('attach_qr_node', function (data) {
	    var user = data.user;
	    var node_name = data.node_name;
	    if (!(user && node_name)) {
		console.log('tried to attach qr node to no user or node name');
		return;
	    }
	    if (active_users.indexOf(user) < 0) {
		console.log('user ' + user + ' is new');
		active_users.push(user);
		user_qr_nodes[user] = [];
	    }

	    var node_entry = {
		socket: soc,
		node_name: node_name
	    };

	    user_qr_nodes[user].push(node_entry);
	    console.log('added user "' + user + '" qr node "' + node_name + '"');
	    
	    soc.on('disconnect', function() {
		console.log("qr node dc'd");

		// TODO: if there are sounding alarms pending on this qr node,
		// this should be removed from the sequence

		var my_qr_nodes = user_qr_nodes[user];
		my_qr_nodes.splice(my_qr_nodes.indexOf(node_entry), 1);
		if (my_qr_nodes.length === 0) {
		    console.log('user ' + user + ' has no more qr nodes');
		    // remove the user
		    active_users.splice(active_users.indexOf(user), 1);
		    user_qr_nodes[user] = null;
		}
	    });
		
	});

	// tell the client to attach
	soc.emit('ready', {});
    }
    
    module.exports.config_trigger_qr_nodes = config_trigger_qr_nodes;
    module.exports.trigger_qr_nodes = trigger_qr_nodes;
    module.exports.attempt_qr_scan = attempt_qr_scan;
    module.exports.add_qr_node_connection = add_qr_node_connection;
})();