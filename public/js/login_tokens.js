
var cookie_object = null;

function find_cookie_object() {
    if (!cookie_object) {
	var cookie_string = readCookie("login_tokens") || "[]";
	cookie_object = JSON.parse(cookie_string);
    }
}

function add_login_token(email, login_token) {
    find_cookie_object();
    
    cookie_object.push({
	email: email, 
	login_token: login_token
    });
    createCookie("login_tokens", JSON.stringify(cookie_object), 365);
}

function find_login_token(email) {
    find_cookie_object();
    for (var i = 0; i < cookie_object.length; ++i) {
	if (cookie_object[i].email === email) {
	    return cookie_object[i].login_token;
	}
    }
}

function get_all_login_emails() {
    find_cookie_object();
    
    var res = [];
    for (var i = 0; i < cookie_object.length; ++i) {
	res.push(cookie_object[i].email);
    }
    return res;
}

