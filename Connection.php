<?php

$server = "localhost";
$gebruikersnaam = "nc_designer";


$verbinding = mysqli_connect($server, $gebruikersnaam);

if (!$verbinding) {
    exit("Er is iets mis gegaan");
}

?>