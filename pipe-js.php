<?

// Look for include file in the same directory (e.g. `./pipe-config.inc.php`).
if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe-config.inc.php'))
  {
    include_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe-config.inc.php';
  }

$json = file_get_contents("php://input");
//echo $postdata." strlen: ".strlen($postdata);

$data = false;
$postdata = "OK:msg:".strlen($json).":".$json;

$fp = NULL;
if(defined('PIPE_URL') && defined('PIPE_PORT'))
  $fp = @fsockopen(PIPE_URL, PIPE_PORT, $errno, $errstr, 1);

if ($fp) 
  {
    stream_set_timeout($fp,1);
    $out = "PUT /msg HTTP/1.0\r\n";
    $out .= "Host: ".PIPE_URL."\r\n";
    $out .= "Accept: */*\r\n";
    $out .= "Connection: Close\r\n";
    $out .= "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n";
    $out .= "Content-Length: ".strlen($postdata)."\r\n";
    $out .= "Pragma: no-cache\r\n";
    $out .= "Connection: close\r\n";
    $out .= "Cache-Control: no-cache\r\n";
    if (isset($_COOKIE["auth"])) 
      {
	$out .= "Cookie: auth=".$_COOKIE["auth"].";\r\n";
      }
    $out .= "\r\n";
    $out .= $postdata;
    
    if (fwrite($fp, $out)) 
      {
	$hdrs = "";
	$body = "";
	$switch = false;
	while (!feof($fp)) {
	  $data = true;
	  $line = fgets($fp, 128);	
	  if(!$switch) 
	    {	  
	      if ($line == "\r\n")
		$switch = true;
	      else
		$hdrs.=$line;
	    }
	  else
	    $body.=$line;
	}
	fclose ($fp);
      }
  }
if (!$data) {
  print "ERROR:Nothing received";
} 
else 
  {
    $headers = http_parse_headers($hdrs);
    
    /** cookie handling */
    if(isset($headers['Set-Cookie'])) 
      {
	if(!is_array($headers['Set-Cookie'])) 
	  {
	    $cd = http_parse_cookie($headers['Set-Cookie']);
	    foreach ($cd->cookies as $key => $value) 
	      {
		if($key == 'auth')
		  {
		    $this->user = current(explode("-", $value));
		  }
		setcookie($key, $value, $cd->expires, $cd->path, $cd->domain);
		$_COOKIE[$key] = $value;
	      }
	  }
      }
    
    print "$body";
  }

?>
