
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

            await runBuildInstructions({
                config: JSON.stringify(config, null, 4)
            });
        }
    }

    return BuildStep;
}


exports.inf = async function (INF, NS) {
    return {
        invoke: async function (pointer, value, options) {
            if (pointer === 'onBuild()') {
                runBuildInstructions = async function (variables) {
                    return INF.load(value, {
                        variables: variables
                    });
                }
                return true;
            }
        }
    };
}
