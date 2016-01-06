<?php 
	$valid_token = 'highcharts.com.cn';
	$client_token = $_GET['token'];
	$client_ip = $_SERVER['REMOTE_ADDR'];

	$fs = fopen('./run.log', 'a');
	fwrite($fs, 'Request on ['.date("Y-m-d H:i:s").'] from ['.$client_ip.']'.PHP_EOL);
	fwrite($fs, print_r($_POST, true).PHP_EOL);
/*	if ($client_token !== $valid_token)
	{
	    echo "error 10001";
	    fwrite($fs, "Invalid token [{$client_token}]".PHP_EOL);
	    exit(0);
	}
*/
	//$json = file_get_contents('php://input');
	//$data = json_decode($json, true);
	//fwrite($fs, 'Data: '.print_r($data, true).PHP_EOL);
	//fwrite($fs, '======================================================================='.PHP_EOL);
	exec('sudo sh hook.sh');
	fwrite($fs, '============= end ========');
	$fs and fclose($fs);
?>
