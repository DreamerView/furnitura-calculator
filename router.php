<?php
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)?:'/';
if(str_starts_with($path,'/storage/')||$path==='/storage') { http_response_code(404); exit; }
$file=__DIR__.$path;
if($path!=='/'&&is_file($file))return false;
if($path==='/')require __DIR__.'/index.php';else { http_response_code(404);echo 'Not found'; }
