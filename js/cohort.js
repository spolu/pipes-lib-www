PIPES.ns('cohort');

PIPES.cohort = function(spec, my) {
    my = my || {};

    my.pipe = PIPES.pipe({});
    my.hash = '';

    var that = {};
    
    var capture, live, day, counter;

    capture = function(action, data) {
	
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

      console.log('calling live');
      
	var msg = {
	    ver: 1,
	    type: '2w',
	    subj: 'COH:GETLIVE',
	    targ: [my.pipe.user()],
	    body: { hash: my.hash }
	};
	my.pipe.msg({ msg: msg,
		      success: function(obj) {
			console.log('cohort: live success pipe');
			if(!obj.error && obj.hash)  {
			  my.hash = obj.hash;
			  if(obj.sessions) {				
			    cb(obj.sessions);
			  }
			  live(cb);
			}
		      },
		      error: function() {
			console.log('cohort: live error pipe');			  
		      }		      
		    });	    		
    };

    day = function(day, month, year, cb) {
		
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
			console.log('cohort: getcounter success pipe');
			  if(obj.day || obj.month || obj.year) {				
			      cb(obj);
			  }
		      },
		      error: function() {
			console.log('cohort: getcounter error pipe');
		      }
		    });	    		
    };

    that.capture = capture;
    that.live = live;
    that.day = day;
    that.counter = counter;

    return that;    
};
