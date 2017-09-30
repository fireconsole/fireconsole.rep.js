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

                    }
                }
            }
        }
    });

    it('Test', function (client) {

        client.url('http://localhost:' + process.env.PORT + '/').pause(500);

        client.waitForElementPresent('BODY', 3000);

        /*
        // TODO: Put this into a test helper.
        client.execute(
            function () {

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '/messages.js';
                document.getElementsByTagName('head')[0].appendChild(script); 

                return "";
            },
            [],
            function (result) {
            }
        );
        */

        client.expect.element('BODY > DIV[class="console.panel"]').text.to.contain([
            '"Hello World!"',
            '[ "Hello World" ]',
            '{ "Hello": "World" }'
        ].join("\n"));

        if (process.env.BO_TEST_FLAG_DEV) client.pause(60 * 60 * 24 * 1000);

    });
});
