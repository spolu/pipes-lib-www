<?

$postdata = file_get_contents("php://input");
//echo $postdata." strlen: ".strlen($postdata);

$url="pipe.bipsly.com";

$fp = @fsockopen($url, 80, $errno, $errstr, 1);
if ($fp) {
  stream_set_timeout($fp,1);
  $out = "PUT /msg HTTP/1.0\r\n";
  $out .= "Host: ".$url."\r\n";
  $out .= "Accept: */*\r\n";
  $out .= "Connection: Close\r\n";
  $out .= "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n";
  $out .= "Content-Length: ".strlen($postdata)."\r\n";
  $out .= "Pragma: no-cache\r\n";
  $out .= "Connection: close\r\n";
  $out .= "Cache-Control: no-cache\r\n";
  $out .= "\r\n";
  $out .= $postdata;
  
  if (fwrite($fp, $out)) {
    $content = "";
    $body = false;
    while (!feof($fp)) {
      $data = true;
      $line = fgets($fp,128);
      if ($line == "\r\n" && !$body) {
	print "$line";	
	$body = true;
      }
      if ($body) {
	$content.=$line;
      }
    }
    fclose ($fp);
  }
}
if (!$data) {
  print "ERROR:Nothin received";
} else {
  print "$content";
}
  
?>
