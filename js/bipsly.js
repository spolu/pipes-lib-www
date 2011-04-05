
var BIPSLY = BIPSLY || {};

BIPSLY.ns = function(ns) {
    var parts = ns.split('.');
    var parent = BIPSLY;    
    
    if(parts[0] === 'BIPSLY')
	parts = parts.slice(1);
    
    for(var i = 0; i < parts.length; i += 1) {
	parent[parts[i]] = parent[parts[i]] || {};
	parent = parent[parts[i]];	
    }
    return parent;
};

BIPSLY.getter = function(obj, my, prop) {
    var getter = function() {
	return my[prop];
    };
    obj[prop] = getter;
};
