var PIPE = PIPE || {};

PIPE.pipe = function(spec, my) {
    my = my || {};

    my.url = spec.url || '/pipe-www/pipe-js.php';

    var that = {};

    var msg;

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
	var data = "OK:msg:" + json.length + ":" + json;
	
	$.ajax({ type: 'POST',
		 url: my.url,
		 data: data,
		 success: function(data, status, xhr) {
		     var res = /OK:body:([0-9]+):(.+)$/.exec(data);
		     if(res && spec.success) {
			 spec.success($.evalJSON(res[2]));
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

    that.msg = msg;
    
    return that;
};
