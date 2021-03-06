PIPES.ns('util.capability');

PIPES.util.capability = 
  (function () {	
     var my = {};
     
     my.capability = {
       'uagent' : navigator.userAgent || navigator.vendor || window.opera,
       'cookie' : false,
       'mobile' : false,
       'jqmobile' : false,
       'btype' : 'unknown',
       'moz': 'unknown'
     };
     
     /** mobile detection */
     my.capability.mobile = 
       /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(my.capability.uagent) || 
       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(my.capability.uagent.substr(0,4));
     
     /** cookie support detection */
     var testexp = new Date();
     testexp.setTime(testexp.getTime() + 1000);
     $.cookie('pipes-test-cookie', 'OK', { path: '/', expires: testexp });
     if($.cookie('pipes-test-cookie'))
       my.capability.cookie = true;

     if(/mozilla\/5\.0/i.test(my.capability.uagent)) {
       if(/android/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'android';
       }
       if(/ip(hone|op|ad)/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'ios';
       }				  
       if(/series60\/5\../i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 's60';
       }
       if(/webos/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'webos';
       }				  
       if(/bada/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'bada';
       }				  
       if(/meego/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'meego';
       }				  
       if(/blackberry/i.test(my.capability.uagent)) {
	 my.capability.jqmobile = true;
	 my.capability.btype = 'bb6';
       }
       if(/MSIE/i.test(my.capability.uagent)) {
	 my.capability.btype = 'ie';
       }
       my.capability.moz = '5.x';
     }
     if(/mozilla\/4\../i.test(my.capability.uagent)) {
       my.capability.moz = '4.x';				  
     }
     if(/mozilla\/3\../i.test(my.capability.uagent)) {
       my.capability.moz = '3.x';				  
     }
     if(/Opera\/9.80/i.test(my.capability.uagent)) {
       my.capability.moz = '5.x';				  	 
       my.capability.btype = 'opera';
     }
     if(/Opera\/9.80/i.test(my.capability.uagent) &&
	/Opera Mobi.*Version\/10\.00/i.test(my.capability.uagent)) {
       my.capability.jqmobile = true;
       my.capability.btype = 'operamobi';
     }
     if(/Opera\/9.80/i.test(my.capability.uagent) &&
	/Opera Mini\/5\.0/i.test(my.capability.uagent)) {
       my.capability.jqmobile = true;
       my.capability.btype = 'operamini';
     }
     if(/Blackberry.{0,5}\/5\.0/i.test(my.capability.uagent)) {
       my.capability.jqmobile = true;
       my.capability.btype = 'bb5';				  
     }
     
     /*
      alert (my.capability.uagent + ' :: ' + 
      my.capability.mobile + ' :: ' + 
      my.capability.cookie + ' :: ' + 
      my.capability.jqmobile + ' :: ' + 
      my.capability.btype);      			      
      */
     
     var that = {};

     PIPES.getter(that, 'uagent', my.capability, 'uagent');
     PIPES.getter(that, 'cookie', my.capability, 'cookie');
     PIPES.getter(that, 'mobile', my.capability, 'mobile');
     PIPES.getter(that, 'jqmobile', my.capability, 'jqmobile');
     PIPES.getter(that, 'btype', my.capability, 'btype');
     PIPES.getter(that, 'moz', my.capability, 'moz');
     
     return that;			    
   }());
