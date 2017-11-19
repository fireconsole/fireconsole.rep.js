#!/usr/bin/env bash.origin.test via github.com/nightwatchjs/nightwatch
/*
module.config = {
    "browsers": [
        "chrome"
    ],
    "test_runner": "mocha"
}
*/

console.log(">>>TEST_IGNORE_LINE:GET /dist/resources/insight.renderers.default/images/<<<");

describe("Suite", function() {

    require('bash.origin.workspace').forPackage(__dirname + '/../..').LIB.BASH_ORIGIN_EXTRASS.runForTestHooks(before, after, {
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
        
        client.expect.element(selector).text.to.contain([
            'Hello World!',
            'array(Hello World)',
            'map(Hello=>World)'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});
