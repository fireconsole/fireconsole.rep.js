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

console.log("process.env.PORT:", process.env.PORT);
console.log("process.env.PHP_PORT:", process.env.PHP_PORT);

const LIB = require('bash.origin.lib').js;

describe("Suite", function() {

    this.timeout(60 * 1000);

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
                                "load": [
                                    "//localhost:" + process.env.PHP_PORT + "/"
                                ]
                            }
                        },
                        "reps": {
                            "fireconsole": __dirname + "/../../src/fireconsole.rep.js"
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

        client.expect.element(selector).text.to.contain(`Hello World
Log message
Info message
Warn message
Error message
LabelMessage with label
TestArraymap('key1'=>'val1','key2'=>array(array('v1','v2'),'v3'))
2 SQL queries took 0.06 seconds
GROUP 1 (2)
Hello World
GROUP 1 (1)
Hello World
shows up in panelbaz
is not displayed in panelFoo(... 0 ...)
is now also not displayed in panelbaz
Что-то
Odómetro
Dumpmap('RequestHeaders'=>map('key1'=>'val1','key2'=>array(array('v1','v2'),'v3')))`);

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});
