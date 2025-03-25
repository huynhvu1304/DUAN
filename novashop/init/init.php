<?php 
include "config.php";
session_start();
$baseurl="http://localhost/novashop";
$action=$_GET['action']??"";
include "controllers/controller.php";