<?php

$password = '123456'; // cambia esto por la contraseña que quieras

$hash = password_hash($password, PASSWORD_DEFAULT);

echo $hash;