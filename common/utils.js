
function rand_int() {
    return Math.random() * 1000000000000000000;
}

if (typeof module !== 'undefined') {
    module.exports.rand_int = rand_int;
}