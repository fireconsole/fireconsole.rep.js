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
PATH = LIB.PATH;

describe("Suite", function() {

    // When started with `--dev`, start the pinf-it tools in --watch mode.

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

                            FC.log("Hello World");
                            FC.log([
                                "Hello World"
                            ]);
                            FC.log({
                                "Hello": "World"
                            });

                        }
                    }
                }
            }            
        }
    });

    it('Test', async function (client) {

        const PORT = (await server).config.port;

        client.url('http://localhost:' + PORT + '/page.html').pause(500);
if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

        var selector = 'BODY[renderer="jsonrep"]';

        client.waitForElementPresent(selector, 5000);
        
        client.expect.element(selector).text.to.contain([
            'Hello World!',
            'Hello World',
            'array(Hello World)',
            'map(Hello=>World)',
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});
