<?

// Look for include file in the same directory (e.g. `./pipe-config.inc.php`).
if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe-config.inc.php'))
  {
    include_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe-config.inc.php';
  }


/**********************************************/
// ENV CONSTANTS
define('PIPE_VERSION', '0.1.4');
define('PIPE_BUILD', '20110224213746');
define('PIPE_USERAGENT', 'pipe' . '/' . PIPE_VERSION . ' PHP/' . PHP_VERSION . ' ' . php_uname('s') . '/' . php_uname('r') . ' Arch/' . php_uname('m') . ' SAPI/' . php_sapi_name() . ' Integer/' . PHP_INT_MAX . ' Build/' . PIPE_BUILD);


/**********************************************/
// PIPE EXCEPTION
class PipeException extends Exception {}

/**********************************************/
// PIPE CLASS
class Pipe
{
  const BUILD = PIPE_BUILD;
  const USERAGENT = PIPE_USERAGENT;
  
  public $url;
  public $port;
  public $user;

  public function __construct($url = null, $port = null) {
    $this->url = null;
    $this->port = null;

    if($url)
      {
	$this->url = $url;
      }
    elseif(defined('PIPE_URL'))
      {
	$this->url = PIPE_URL;
      }

    if($port)
      {
	$this->port = $port;
      }
    elseif(defined('PIPE_PORT'))
      {
	$this->port = PIPE_PORT;
      }
    
    $this->user = '';
  }
  
  public function set_user($user)
  {
    $this->user = $user;
  }

  /**
   * Extracts the user from an auth cookie
   * 
   */
  public function user_from_auth($cookie)
  {
    if(preg_match('/^([a-zA-Z0-9]+)-(.+)-([a-zA-Z0-9]+)$/', $cookie, $matches))
      {
	$user = $matches[1];
	$expiry = $matches[2];
	$check = $matches[3];
	return $user;
      } 
  }
  
  /**
   * Builds a json representation of a message
   * 
   * @param string $subj the subject of the message
   * @param string $targ the target of the message
   * @param string $body (optional) JSON representation of the body of the message
   * @param string $type (optional) type of the messsage 1w/2w
   * @return string JSON representation of the message
   */
  public function build_msg($subj, $targ, $body = null, $type = "2w") 
  {
    if(!$subj || !$targ) 
      {
	throw new PipeException('Missing subject or target to build pipe message');
      }    
    $msg = '{"ver":"1","type":"'.$type.'","subj":"'.$subj.'","targ":["'.$targ.'"]';
    if($body != NULL)
      $msg .= ',"body":'.$body;
    $msg .= '}';
    
    return $msg;
  }

  /**
   * Send a json string message to pipe
   * 
   * @param string $json JSON representattion of the message to send
   */
  public function pipe_msg($json) 
  {
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
      throw new PipeException('Connection to pipe failed');
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
	
	if(preg_match('/OK:body:(?P<digit>\d*):(?P<data>.*)$/', $body, $matches)) 
	  {
	    return json_decode($matches["data"]);
	  }
	else 
	  {
	    throw new PipeException('Error: '.$body);
	  }
      }
  }  
}
  
?>
