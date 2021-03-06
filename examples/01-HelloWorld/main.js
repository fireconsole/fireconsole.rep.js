#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

const PATH = require("path");

console.log(">>>TEST_IGNORE_LINE:GET /dist/insight.domplate.reps/<<<");
console.log(">>>TEST_IGNORE_LINE:GET /dist/<<<");
console.log(">>>TEST_IGNORE_LINE:Routing request /<<<");

describe("Suite", function() {

    require('bash.origin.lib').forPackage(__dirname).js.BASH_ORIGIN_EXPRESS.runForTestHooks(before, after, {
        "routes": {
            "^/": {
                "@github.com~jsonrep~jsonrep#s1": {
                    "dist": PATH.join(__dirname, ".dist", "index.html"),
                    "prime": true,
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
                    "code": function CodeBlock /*CodeBlock*/ () {

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
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);
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
