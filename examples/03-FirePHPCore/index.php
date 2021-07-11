<?php

$headers = array();

require_once 'vendor/firephp/firephp-core/lib/FirePHPCore/FirePHP.class.php';

/* NOTE: You must have Output Buffering enabled via
        ob_start() or output_buffering ini directive. */

class Logger extends FirePHP {

    protected $headers = array();

    public function getHeaders () {
        return $this->headers;
    }

    protected function setHeader($name, $value) {
        $this->headers[$name] = $value;
    }

    protected function headersSent(&$filename, &$linenum) {
        return false;
    }

    public function detectClientExtension() {
        return true;
    }        
}

$firephp = new Logger();
$firephp->setEnabled(true);

$firephp->fb('Hello World'); /* Defaults to FirePHP::LOG */
$firephp->fb('Log message'  ,FirePHP::LOG);
$firephp->fb('Info message' ,FirePHP::INFO);

$firephp->fb('Warn message' ,FirePHP::WARN);
$firephp->fb('Error message',FirePHP::ERROR);
$firephp->fb('Message with label','Label',FirePHP::LOG);

$arr = array(
    'key1'=>'val1',
    'key2'=>array(array('v1','v2'),'v3')
);

$firephp->fb($arr,'TestArray',FirePHP::LOG);
$firephp->fb(array('2 SQL queries took 0.06 seconds',array(
    array('SQL Statement','Time','Result'),
    array('SELECT * FROM Foo','0.02',array('row1','row2')),
    array('SELECT * FROM Bar','0.04',array('row1','row2'))
)),FirePHP::TABLE);

$firephp->group('Group 1');
    $firephp->fb('Hello World');
    $firephp->group('Group 1');
        $firephp->fb('Hello World');
    $firephp->groupEnd();
$firephp->groupEnd();


// @see https://github.com/firephp/firephp-for-firefox-devtools/issues/40
class Foo {
    function bar () {
        return "baz";
    }
}
$foo = new Foo();
$firephp->warn($foo->bar(), 'shows up in panel');
$firephp->warn($foo, 'is not displayed in panel');
$firephp->warn($foo->bar(), 'is now also not displayed in panel');


// @see https://github.com/firephp/firephp/issues/16
$firephp->info("Что-то");
$firephp->info("Odómetro");



$firephp->fb($arr,'RequestHeaders',FirePHP::DUMP);


print "FC.send([";
foreach ($firephp->getHeaders() as $name => $value) {
    print "'$name: " . str_replace("\\", "\\\\", $value) . "',\n";
}
print "]);";
