<?php
$url = 'http://localhost/zazdent/public/api/auth/login';
$data = array('username' => 'admin', 'password' => 'wrongpass'); 
$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo "Response: " . $result . "\n";
