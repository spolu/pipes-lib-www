<?

// Look for include file in the same directory (e.g. `./pipe-config.inc.php`).
if (file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe.class.php'))
  {
    include_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'pipe.class.php';
  }

class Cohort extends Pipe {

  public function __constructor($url = null, $port = null)
  {
    parent::__construct($url, $port);
  }
  
  public function capture($action, $data = null)
  {
    try
      {
	if(isset($action) && $this->user())
	  {
	    if(isset($data))
	      {
		$res = $this->pipe_msg($this->build_msg("COH:CAPTURE",
							$this->user(),
							'{'.
							   '"action":"'.$action.'",'.
							   '"data":'.$data.''.					      
							'}','1w')); 
	      }
	    else
	      {
		$res = $this->pipe_msg($this->build_msg("COH:CAPTURE",
							$this->user(),
							'{'.
							  '"action":"'.$action.'"'.
							'}','1w')); 
	      }
	  }
	if(!$res)
	  {
	    /** NOTHING TO DO */
	  }
      }
    catch (Exception $e) 
      {
	/** NOTHING TO DO */
      }
  }  
}