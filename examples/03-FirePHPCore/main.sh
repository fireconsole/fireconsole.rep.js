#!/usr/bin/env bash.origin.script

depend {
    "php": "@com.github/bash-origin/bash.origin.php#s1",
    "process": "@com.github/bash-origin/bash.origin.process#s1"
}

echo "TEST_MATCH_IGNORE>>>"

CALL_php composer install


local port="$(CALL_process free_port)"
echo "PHP server port: ${port}"

CALL_php start "${port}"


export PHP_PORT="${port}"

BO_TEST_BASE_DIR= bash.origin.test main.js


echo "<<<TEST_MATCH_IGNORE"

echo "OK"

echo "TEST_MATCH_IGNORE>>>"

CALL_php stop "${port}"
