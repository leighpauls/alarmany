(function() {

    function check_err(cb) {
	return function(err, val) {
	    if (err) {
		console.log(err);
		return;
	    }
	    cb(val);
	};
    }

    function get_mongo_server(callback) {
	var mongo = require('mongodb');

	var mongo_server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
	var mongo_db = new mongo.Db('exampleDb', mongo_server);

	mongo_db.open(check_err(function(db) {
	    db.collection('alarms', check_err(function(alarms) {
		callback(alarms);
	    }));
	}));
    }

    module.exports.get_mongo_server = get_mongo_server;

})();
