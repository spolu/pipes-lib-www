BIPSLY.ns('cohort');

BIPSLY.cohort = function(spec, my) {
    my = my || {};

    my.pipe = BIPSLY.pipe({});
    my.hash = '';

    var that = {};
    
    var capture, live, day, counter;

    capture = function(action, data) {
	
	if(!my.pipe.user())
	    return;

	if(typeof action === 'undefined')
	    return;
	
	if(typeof data !== 'undefined') {
	    /** TODO: add location */
	    var msg = {
		ver: 1,
		type: '1w',
		subj: 'COH:CAPTURE',
		targ: [my.pipe.user()],
		body: { action: action,
			data: data }
	    };
	    my.pipe.msg({ msg: msg });
	}
	else {
	    /** TODO: add location */
	    var msg = {
		ver: 1,
		type: '1w',
		subj: 'COH:CAPTURE',
		targ: [my.pipe.user()],
		body: { action: action }
	    };
	    my.pipe.msg({ msg: msg });	    
	}	
    };

    live = function(cb) {
	
	if(!my.pipe.user())
	    return;
	
	var msg = {
	    ver: 1,
	    type: '2w',
	    subj: 'COH:GETLIVE',
	    targ: [my.pipe.user()],
	    body: { hash: my.hash }
	};
	my.pipe.msg({ msg: msg,
		      success: function(obj) {
			if(!obj.error && obj.hash)  {
			    my.hash = obj.hash;
			    if(obj.sessions) {				
				cb(obj.sessions);
			    }
			    live(cb);
			}
		      }
		    });	    		
    };

    day = function(day, month, year, cb) {
	
	if(!my.pipe.user())
	    return;
	
	var msg = {
	    ver: 1,
	    type: '2w',
	    subj: 'COH:GETDAY',
	    targ: [my.pipe.user()],
	    body: { day: day,
		    month: month,
		    year: year }
	};
	my.pipe.msg({ msg: msg,
		      success: function(obj) {
			  if(obj.sessions) {				
			      cb(obj.sessions);
			  }
		      }
		    });	    		
    };

    counter = function(day, month, year, cb) {
	
	if(!my.pipe.user())
	    return;
	
	var msg = {
	    ver: 1,
	    type: '2w',
	    subj: 'COH:GETCOUNTER',
	    targ: [my.pipe.user()],
	    body: { day: day,
		    month: month,
		    year: year }
	};
	my.pipe.msg({ msg: msg,
		      success: function(obj) {
			  if(obj.day || obj.month || obj.year) {				
			      cb(obj);
			  }
		      }
		    });	    		
    };

    that.capture = capture;
    that.live = live;
    that.day = day;
    that.counter = counter;

    return that;    
};
