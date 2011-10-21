var PIPES = PIPES || {};

PIPES.ns = function(ns) {
    var parts = ns.split('.');
    var parent = PIPES;    
    
    if(parts[0] === 'PIPES')
	parts = parts.slice(1);
    
    for(var i = 0; i < parts.length; i += 1) {
	parent[parts[i]] = parent[parts[i]] || {};
	parent = parent[parts[i]];	
    }
    return parent;
};

PIPES.getter = function(obj, my, prop) {
    var getter = function() {
	return my[prop];
    };
    obj[prop] = getter;
};



/** OBJECT EXTENSION */

var dateFormat = function () {
  var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
  timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
  timezoneClip = /[^-+\dA-Z]/g,
  pad = function (val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) val = "0" + val;
    return val;
  };
  
  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;
    
    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }
    
    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");
    
    mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    
    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }
    
    var	_ = utc ? "getUTC" : "get",
    d = date[_ + "Date"](),
    D = date[_ + "Day"](),
    m = date[_ + "Month"](),
    y = date[_ + "FullYear"](),
    H = date[_ + "Hours"](),
    M = date[_ + "Minutes"](),
    s = date[_ + "Seconds"](),
    L = date[_ + "Milliseconds"](),
    o = utc ? 0 : date.getTimezoneOffset(),
    flags = {
      d:    d,
      dd:   pad(d),
      ddd:  dF.i18n.dayNames[D],
      dddd: dF.i18n.dayNames[D + 7],
      m:    m + 1,
      mm:   pad(m + 1),
      mmm:  dF.i18n.monthNames[m],
      mmmm: dF.i18n.monthNames[m + 12],
      yy:   String(y).slice(2),
      yyyy: y,
      h:    H % 12 || 12,
      hh:   pad(H % 12 || 12),
      H:    H,
      HH:   pad(H),
      M:    M,
      MM:   pad(M),
      s:    s,
      ss:   pad(s),
      l:    pad(L, 3),
      L:    pad(L > 99 ? Math.round(L / 10) : L),
      t:    H < 12 ? "a"  : "p",
      tt:   H < 12 ? "am" : "pm",
      T:    H < 12 ? "A"  : "P",
      TT:   H < 12 ? "AM" : "PM",
      Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };
    
    return mask.replace(token, function ($0) {
			  return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};




PIPES.ns('pipe');

PIPES.pipe = function(spec, my) {
    my = my || {};
    
    my.url = spec.url || '/lib/pipes-lib-www/pipe-js.php';

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
