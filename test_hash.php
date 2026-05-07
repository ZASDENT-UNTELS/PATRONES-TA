<?php
$start = microtime(true);
$hash = '$2y$10$7CJeeAIbRfGwrHaXLmdeiO6N4KAH.3JGBZBXKK7uEMHvj.ScKx.ym';
$res = password_verify('123456', $hash);
$end = microtime(true);
echo "Verify result: " . ($res ? 'true' : 'false') . "\n";
echo "Time: " . ($end - $start) . " seconds\n";
