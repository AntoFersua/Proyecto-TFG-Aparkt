<?php
    class Configuracion {
        public static function get ($apiKey){
            $value = getenv($apiKey);
            if ($value !== false) {
                return $value;
            }
            $env = parse_ini_file(__DIR__ . '/../../.env');
            return $env[$apiKey] ?? null;
        }
    } 
?>