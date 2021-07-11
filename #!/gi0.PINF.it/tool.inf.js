
let runBuildInstructions = null;

exports['gi0.PINF.it/build/v0'] = async function (LIB, CLASSES) {

    class BuildStep extends CLASSES.BuildStep {

        async onBuild (result, build, target, instance, home, workspace) {

            const defaultConfig = {
                "basedir": build.path,
                "externalizeCss": true,
                "include": {
                    "jquery": false,
                    "regenerator-runtime": false,
                    "riot.csp.js": true,
                    "riot.js": true,
                    "riot.min.js": true
                },
                "page": {},
                "reps": {
                    "fireconsole": LIB.PATH.join(__dirname, "../../src/fireconsole.rep.js")
                }
            };
            const customConfig = build.config;
            const config = LIB.LODASH.merge({}, defaultConfig, customConfig);

// console.log('RUN BUILD INSTRUCTIONs >>>');

// TODO: These instructions do not re-execute currently.
            await runBuildInstructions({
                config: JSON.stringify(config, null, 4)
            });

// console.log('<<< RAN BUILD INSTRUCTIONs');

            // TODO: Track 'inputPaths' and 'outputPaths' based
            //       on what is returned by runBuildInstructions()
            //       combined result above.
            // result.inputPaths[build.path] = true;
            // result.outputPaths[target.path] = true;

            // For now we only trigger one specific path so we can trigger a new build.
            result.inputPaths[LIB.PATH.join(__dirname, "../../src/fireconsole.rep.js")] = true;
        }
    }

    return BuildStep;
}


exports.inf = async function (INF, NS) {
    return {
        invoke: async function (pointer, value, options) {
            if (pointer === 'onBuild()') {
                runBuildInstructions = async function (variables) {

// console.log('RUN LOAD');

                    return INF.load(value, {
                        variables: variables
                    });
                }
                return true;
            }
        }
    };
}
