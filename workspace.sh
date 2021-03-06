#!/usr/bin/env bash.origin.script

depend {
    "component": {
        "gi0.CADorn.org~component#s1": {
            "readme": "$__DIRNAME__/README.md",
            "variables": {
                "PACKAGE_NAME": "fireconsole.rep.js",
                "PACKAGE_GITHUB_URI": "github.com/fireconsole/fireconsole.rep.js",
                "PACKAGE_WEBSITE_SOURCE_URI": "github.com/fireconsole/fireconsole.rep.js/tree/master/workspace.sh",
                "PACKAGE_CIRCLECI_NAMESPACE": "fireconsole/fireconsole.rep.js",
                "PACKAGE_NPM_PACKAGE_NAME": "fireconsole.rep.js",
                "PACKAGE_NPM_PACKAGE_URL": "https://www.npmjs.com/package/fireconsole.rep.js",
                "PACKAGE_WEBSITE_URI": "fireconsole.github.io/fireconsole.rep.js",
                "PACKAGE_YEAR_CREATED": "2017",
                "PACKAGE_LICENSE_ALIAS": "MPL",
                "PACKAGE_SUMMARY": "$__DIRNAME__/GUIDE.md"
            },
            "routes": {
                "/dist/fireconsole.rep.js": {
                    "@github.com~jsonrep~jsonrep#s1": {
                        "externalizeCss": true,
                        "dist": "$__DIRNAME__/dist/fireconsole.html",
                        "prime": true,
                        "page": {
                            "@fireconsole": {
                                "messages": [
                                    "Hello World!"
                                ]
                            }
                        },
                        "reps": {
                            "fireconsole": "$__DIRNAME__/src/fireconsole.rep.js"
                        }
                    }
                }
            }
        }
    }
}

BO_parse_args "ARGS" "$@"

if [ "$ARGS_1" == "publish" ]; then

    # TODO: Add option to track files and only publish if changed.
    CALL_component publish ${*:2}

elif [ "$ARGS_1" == "build" ]; then

    CALL_component build ${*:2}

elif [ "$ARGS_1" == "run" ]; then

    CALL_component run ${*:2}

fi
