#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

describe("Suite", function() {

    require('bash.origin.express').runForTestHooks(before, after, {
        "routes": {
            "^/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "page": {
                        "@fireconsole": {
                            "messages": [
                                "Hello World!"
                            ],
                            "load": [
                                "/messages.js"
                            ]
                        }
                    },
                    "reps": {
                        "fireconsole": __dirname + "/../../src/fireconsole.rep.js"
                    }
                }
            },
            "/messages.js": {
                "@it.pinf.org.browserify#s1": {
                    "code": function /* CodeBlock */ () {

                        FC.log([
                            "Hello World"
                        ]);
                        FC.log({
                            "Hello": "World"
                        });
                        
                        var count = 0;

                        function prependLength (msg) {
                            count += 1;
                            return msg.length + "|" + msg;
                        }

                        FC.send([
                            'X-Wf-1-1-1-1: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"11"},"Hello World"]') + '|',
                            'X-Wf-1-1-1-2: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"12"},"Log message"]') + '|',
                            'X-Wf-1-1-1-3: ' + prependLength('[{"Type":"INFO","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"13"},"Info message"]') + '|',
                            'X-Wf-1-1-1-4: ' + prependLength('[{"Type":"WARN","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"14"},"Warn message"]') + '|',
                            'X-Wf-1-1-1-5: ' + prependLength('[{"Type":"ERROR","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"15"},"Error message"]') + '|',
                            'X-Wf-1-1-1-6: ' + prependLength('[{"Type":"LOG","Label":"Label","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"16"},"Message with label"]') + '|',
                            'X-Wf-1-1-1-7: ' + prependLength('[{"Type":"LOG","Label":"TestArray","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"21"},{"key1":"val1","key2":[["v1","v2"],"v3"]}]') + '|',

                            'X-Wf-1-1-1-8: ' + prependLength('[{"Type":"TABLE","File":"/tests/03-Messages-FirePHPCore/index.php","Line":26},["2 SQL queries took 0.06 seconds",[["SQL Statement","Time","Result"],["SELECT * FROM Foo","0.02",["row1","row2"]],["SELECT * FROM Bar","0.04",["row1","row2"]]]]]') + '|',

                            'X-Wf-1-1-1-9: ' + prependLength('[{"Type":"GROUP_START","Label":"Group 1","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"28"},null]') + '|',
                            'X-Wf-1-1-1-10: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"29"},"Hello World"]') + '|',
                            'X-Wf-1-1-1-11: ' + prependLength('[{"Type":"GROUP_START","Label":"Group 1","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"30"},null]') + '|',
                            'X-Wf-1-1-1-12: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"31"},"Hello World"]') + '|',
                            'X-Wf-1-1-1-13: ' + prependLength('[{"Type":"GROUP_END","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"32"},null]') + '|',
                            'X-Wf-1-1-1-14: ' + prependLength('[{"Type":"GROUP_END","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"33"},null]') + '|',

                            'X-Wf-1-Structure-1: http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1',
                            'X-Wf-Protocol-1: http://meta.wildfirehq.org/Protocol/JsonStream/0.2',
                            'X-Wf-1-Plugin-1: http://meta.firephp.org/Wildfire/Plugin/FirePHP/Library-FirePHPCore/0.3',
                            'X-Wf-1-Structure-2: http://meta.firephp.org/Wildfire/Structure/FirePHP/Dump/0.1',
                            'X-Wf-1-Index: ' + count
                        ]);
                    }
                }
            },
            "/dist/resources/insight.renderers.default/*": __dirname + "/../../node_modules/insight.renderers.default/resources"
        }
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);

        var selector = 'BODY[renderer="jsonrep"] DIV[class="console-container"]';
        
        client.waitForElementPresent(selector, 3000);

//if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);
        
        client.expect.element(selector).text.to.contain([
            'Hello World!',
            'array(Hello World)',
            'map(Hello=>World)',
            'Hello World',
            'Log message',
            'Info message',
            'Warn message',
            'Error message',
            'LabelMessage with label',
            'TestArraymap(key1=>val1,key2=>array(array(v1,v2),v3))',
            'map(data=>array(array(SELECT * FROM Foo,0.02,array(row1,row2)),array(SELECT * FROM Bar,0.04,array(row1,row2))),header=>array(SQL Statement,Time,Result),title=>2 SQL queries took 0.06 seconds)',
            'Group 1 (2)',
            'Hello World',
            'Group 1 (1)',
            'Hello World'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});