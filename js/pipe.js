BIPSLY.ns('pipe');

BIPSLY.pipe = function(spec, my) {
    my = my || {};
    
    my.url = spec.url || '/pipes-lib-www/pipe-js.php';

    var that = {};

    var msg, user;

    msg = function(spec, cb) {

	spec.msg.ver = spec.msg.ver || 1;
	spec.msg.type = spec.msg.type || '2w';

	if(typeof spec.msg.subj === "undefined") {
	    if(spec.error)
		spec.error(new Error('subj not specified'));
	    return ;	    
	}
	if(typeof spec.msg.targ === "undefined") {
	    if(spec.error)
		spec.error(new Error('targ not specified'));
	    return ;	    
	}
	
	var json = $.toJSON(spec.msg);
	
	$.ajax({ type: 'POST',
		 url: my.url,
		 data: json,
		 success: function(data, status, xhr) {
		     var res = /OK:body:([0-9]+):(.+)$/.exec(data);
		     if(res) {
			 if(spec.success) {
			     spec.success($.evalJSON(res[2]));
			 }
		     }
		     else if(spec.error) {
			 spec.error(new Error(data));
		     }
		 },
		 error: function(qXHR, textStatus, errorThrown) {
		     if(spec.error)
			 spec.error(textStatus);
		 }
	       });
    };

    user = function() {
	if($.cookie('auth')) {
	    var auth = /^([a-zA-Z0-9]+)-(.+)-([a-zA-Z0-9]+)$/.exec($.cookie('auth'));
	    if(auth) {
		return auth[1];
	    }
	}
	return undefined;
    };

    that.msg = msg;
    that.user = user;
    
    return that;
};
