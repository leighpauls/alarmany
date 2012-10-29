function init_user_controls(node, email) {
    var email_space = node.find('.alm-email-space');
    console.log(email);
    console.log(email_space);
    email_space.text(email);
}