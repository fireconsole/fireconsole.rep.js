#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

console.log(">>>TEST_IGNORE_LINE:GET /dist/insight.domplate.reps/<<<");
console.log(">>>TEST_IGNORE_LINE:GET /dist/<<<");
console.log(">>>TEST_IGNORE_LINE:Routing request /<<<");
console.log(">>>TEST_IGNORE_LINE:Writing to:<<<");
console.log(">>>TEST_IGNORE_LINE:Run tool step for:<<<");
console.log(">>>TEST_IGNORE_LINE:Adding route:<<<");
console.log(">>>TEST_IGNORE_LINE:Mounting route<<<");
console.log(">>>TEST_IGNORE_LINE:MaxListenersExceededWarning:<<<");

const LIB = require('bash.origin.lib').js;

describe("Suite", function() {

    const server = LIB.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "mountPrefix": "/.tmp",
        "routes": {
            "^/": {
                "gi0.PINF.it/build/v0 # /reps # /": {
                    "@jsonrep # router/v1": {
                        "include": {
                            "jquery": false,
                            "regenerator-runtime": false
                        },
                        "page": {
                            "@fireconsole": {
                                "messages": [
                                    "Hello World!"
                                ],
                                "load": [
                                    "/data/messages.js"
                                ]
                            }
                        },
                        "reps": {
                            "fireconsole": __dirname + "/../../src/fireconsole.rep.js"
                        }
                    }
                }
            },
            "^/data": {
                "gi0.PINF.it/build/v0 # / # /messages.js": {
                    "@it.pinf.org.browserify # router/v1": {
                        "code": function () {

                            function ensureInspectorPanel () {
                                var el = document.querySelector('BODY > DIV.viewer');
                                if (!el) {
                                    el = document.createElement('DIV');
                                    el.setAttribute("class", "viewer");
                                    document.body.appendChild(el);
                                }
                                return el;
                            }
                            FC.on("inspectMessage", function (info) {
                                FC.renderMessageInto(ensureInspectorPanel(), info.node);
                            });
                            FC.on("inspectNode", function (info) {
                                FC.renderMessageInto(ensureInspectorPanel(), info.node);
                            });
                            FC.on("inspectFile", function (info) {
                                console.log("Inspect File:", info);
                            });


                            FC.log("Hello World");
                            FC.log([
                                "Hello World"
                            ]);
                            FC.log({
                                "Hello": "World"
                            });
                            FC.info("Hello World");
                            FC.warn("Hello World");
                            FC.error("Hello World");
                            FC.label("Label").log([
                                "Message with label"
                            ]);
                            FC.label("Test Array").log({
                                "key1": "val1",
                                "key2": [
                                    [
                                        "v1",
                                        "v2"
                                    ],
                                    "v3"
                                ]
                            });

                            FC.send({
                                "sender": "http://meta.firephp.org/Wildfire/Plugin/FirePHP/Library-FirePHPCore/0.3",
                                "receiver": "http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1",
                                "meta": "{\"msg.preprocessor\":\"FirePHPCoreCompatibility\",\"target\":\"console\",\"lang.id\":\"registry.pinf.org/cadorn.org/github/renderers/packages/php/master\",\"priority\":\"log\",\"file\":\"/dl/source/github.com~firephp~firephp-for-firefox-devtools/tests/03-Messages-FirePHPCore/index.php\",\"line\":11}",
                                "data": "\"Hello World (via send)\""
                            });

                            FC.send({
                                "sender": "http://meta.firephp.org/Wildfire/Plugin/FirePHP/Library-FirePHPCore/0.3",
                                "receiver": "http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1",
                                "meta": "{\"msg.preprocessor\":\"FirePHPCoreCompatibility\",\"target\":\"console\",\"lang.id\":\"registry.pinf.org/cadorn.org/github/renderers/packages/php/master\",\"priority\":\"log\",\"label\":\"TestArray\",\"file\":\"/dl/source/github.com~firephp~firephp-for-firefox-devtools/tests/03-Messages-FirePHPCore/index.php\",\"line\":21}",
                                "data": "{\"key1\":\"val1\",\"key2\":[[\"v1\",\"v2\"],\"v3\"]}"
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
                                'X-Wf-1-1-1-9: ' + prependLength('[{"Type":"EXCEPTION","File":"\/app\/_header.php","Line":17},{"Class":"Exception","Message":"Test Exception","File":"\/app\/_header.php","Line":17,"Type":"throw","Trace":[{"file":"\/app\/_header.php","line":20,"function":"test","args":[{"Hello":"World"}]},{"file":"\/app\/index.php","line":3,"args":["\/app\/_header.php"],"function":"require"}]}]') + '|',
                                'X-Wf-1-1-1-10: ' + prependLength('[{"Type":"TRACE","File":"\/app\/_header.php","Line":25},{"Class":"","Type":"","Function":"fb","Message":"Backtrace to here","File":"\/app\/_header.php","Line":25,"Args":["Backtrace to here","TRACE"],"Trace":[{"file":"\/app\/index.php","line":3,"args":["\/app\/_header.php"],"function":"require"}]}]') + '|',

                                'X-Wf-1-1-1-11: ' + prependLength('[{"Type":"GROUP_START","Label":"Group 1","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"28"},null]') + '|',
                                'X-Wf-1-1-1-12: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"29"},"Hello World"]') + '|',
                                'X-Wf-1-1-1-13: ' + prependLength('[{"Type":"GROUP_START","Label":"Group 1","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"30"},null]') + '|',
                                'X-Wf-1-1-1-14: ' + prependLength('[{"Type":"LOG","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"31"},"Hello World"]') + '|',
                                'X-Wf-1-1-1-15: ' + prependLength('[{"Type":"GROUP_END","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"32"},null]') + '|',
                                'X-Wf-1-1-1-16: ' + prependLength('[{"Type":"GROUP_END","File":"/tests/03-Messages-FirePHPCore/index.php","Line":"33"},null]') + '|',

                                'X-Wf-1-2-1-17: ' + prependLength('{"RequestHeaders":{"key1":"val1","key2":[["v1","v2"],"v3"]}}') + '|',

                                'X-Wf-1-Structure-1: http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1',
                                'X-Wf-Protocol-1: http://meta.wildfirehq.org/Protocol/JsonStream/0.2',
                                'X-Wf-1-Plugin-1: http://meta.firephp.org/Wildfire/Plugin/FirePHP/Library-FirePHPCore/0.3',
                                'X-Wf-1-Structure-2: http://meta.firephp.org/Wildfire/Structure/FirePHP/Dump/0.1',
                                'X-Wf-1-Index: ' + count
                            ]);
                        }
                    }
                }
            }
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        client.url('http://localhost:' + process.env.PORT + '/page.html').pause(500);

if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        var selector = 'BODY[renderer="jsonrep"]';

        client.waitForElementPresent(selector, 5000);

        client.expect.element(selector).text.to.contain(`Hello World!
Hello World
array(Hello World)
map(Hello=>World)
Hello World
Hello World
Hello World
Labelarray(Message with label)
Test Arraymap(key1=>val1,key2=>array(array(v1,v2),v3))
Hello World (via send)
TestArraymap('key1'=>'val1','key2'=>array(array('v1','v2'),'v3'))
Hello World
Log message
Info message
Warn message
Error message
LabelMessage with label
TestArraymap('key1'=>'val1','key2'=>array(array('v1','v2'),'v3'))
2 SQL queries took 0.06 seconds
Test Exception
Backtrace to here
GROUP 1 (2)
Hello World
GROUP 1 (1)
Hello World`);

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});
