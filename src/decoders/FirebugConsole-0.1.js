
const VERBOSE = false;

const ENCODER = require("insight-for-js/lib/encoder/default");


var encoder = ENCODER.Encoder();
encoder.setOption("maxObjectDepth", 1000);
encoder.setOption("maxArrayDepth", 1000);
encoder.setOption("maxOverallDepth", 1000);


class Decoder {

    formatMessage (message) {

        let node = {
            "#": "InsightTree",
            "meta": {}
        };

        try {

            if (VERBOSE) console.log("Decoder.formatMessage():", message);

            let dataNode = null;
            let meta = JSON.parse(message.meta);
            let data = JSON.parse(message.data);

            if (VERBOSE) console.log("Decoder.formatMessage() meta:", JSON.stringify(meta, null, 4));
            if (VERBOSE) console.log("Decoder.formatMessage() data:", JSON.stringify(data, null, 4));

            if (
                meta["lang.id"] === "registry.pinf.org/cadorn.org/github/renderers/packages/php/master" &&
                meta["msg.preprocessor"] === "FirePHPCoreCompatibility"
            ) {
                /*
                    meta: {
                        file: "/tests/03-Messages-FirePHPCore/index.php"
                        lang.id: "registry.pinf.org/cadorn.org/github/renderers/packages/php/master"
                        line: 26
                        msg.preprocessor: "FirePHPCoreCompatibility"
                        renderer: "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0:structures/table"
                        target: "console"
                    }
                    data: "{"data":[["SELECT * FROM Foo","0.02",["row1","row2"]],["SELECT * FROM Bar","0.04",["row1","row2"]]],"header":["SQL Statement","Time","Result"],"title":"2 SQL queries took 0.06 seconds"}"
                */
                if (meta["renderer"] === "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0:structures/table") {
                    node.meta = {
                        "lang": "default",
                        "lang.type": "table"                    
                    };
                    node.value = {
                        title: {
                            type: "string",
                            value: data.title
                        },
                        header: data.header.map(function (value) {
                            return {
                                type: "string",
                                value: value
                            };
                        })
                    };

                    dataNode = encoder.encode(data.data, {
                        "lang": "php"
                    }, {
                        "jsonEncode": false
                    });

                    // TODO: Support object references
                    node.value.body = dataNode.origin.value.map(function (row) {
                        return row.value;
                    });

                    node.instances = dataNode.instances;
                } else
                /*
                    meta: {
                        "msg.preprocessor": "FirePHPCoreCompatibility",
                        "target": "console",
                        "lang.id": "registry.pinf.org/cadorn.org/github/renderers/packages/php/master",
                        "renderer": "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0:structures/trace",
                        "file": "/app/_header.php",
                        "line": 25
                    }
                    data: "{"title":"Backtrace to here","trace":[{"class":"","type":"","function":"fb","file":"/app/_header.php","line":25,"args":["Backtrace to here","TRACE"]},{"file":"/app/index.php","line":3,"args":["/app/_header.php"],"function":"require"}]}"
                */
                if (meta["renderer"] === "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0:structures/trace") {
                    node.meta = {
                        "lang": "default",
                        "lang.type": "trace"                    
                    };
                    node.value = {
                        title: {
                            type: "string",
                            value: data.title
                        }
                    };

                    node.value.stack = data.trace.map(function (frame) {

                        dataNode = encoder.encode(frame.args || [], {
                            "lang": "php"
                        }, {
                            "jsonEncode": false
                        });

                        return {
                            file: frame.file,
                            line: frame.line,
                            class: frame.class,
                            function: frame.function,
                            args: dataNode.origin.value.map(function (arg) {
                                return arg;
                            })
                        };
                    });
                } else
                /*
                    meta: "{"msg.preprocessor":"FirePHPCoreCompatibility","target":"console","lang.id":"registry.pinf.org/cadorn.org/github/renderers/packages/php/master","priority":"error","file":"/app/_header.php","line":17}"
                    data: "{"__className":"Exception","__isException":true,"protected:message":"Test Exception","protected:file":"/app/_header.php","protected:line":17,"private:trace":[{"class":"Exception","type":"throw","function":"","file":"/app/_header.php","line":17,"args":""},{"file":"/app/_header.php","line":20,"function":"test","args":[{"Hello":"World"}]},{"file":"/app/index.php","line":3,"args":["/app/_header.php"],"function":"require"}]}"
                */
                if (data && data.__isException === true) {
                    node.meta = {
                        "lang": "default",
                        "lang.type": "trace"                    
                    };
                    node.value = {
                        title: {
                            type: "string",
                            value: data['protected:message']
                        }
                    };
                    node.value.stack = data["private:trace"].map(function (frame) {
                        dataNode = encoder.encode(frame.args || [], {
                            "lang": "php"
                        }, {
                            "jsonEncode": false
                        });

                        return {
                            file: frame.file,
                            line: frame.line,
                            class: frame.class,
                            function: frame.function,
                            args: dataNode.origin.value.map(function (arg) {
                                return arg;
                            })
                        };
                    });
                } else
                /*
                    data: { "__className": "Foo" }
                */
                if (
                    data &&
                    typeof data === "object" &&
                    typeof data.__className === "string"
                ) {
                    dataNode = encoder.encode(data, {
                        "lang": "php"
                    }, {
                        "jsonEncode": false
                    });

                    node.meta = dataNode.origin.meta;
                    node.type = dataNode.origin.type;
                    node.value = dataNode.origin.value;
                    node.instances = dataNode.instances;
                } else {

                    dataNode = encoder.encode(data, {
                        "lang": "php"
                    }, {
                        "jsonEncode": false
                    });

                    node.meta = dataNode.origin.meta;
                    node.value = dataNode.origin.value;
                    node.instances = dataNode.instances;
                }
            }

            [
                'priority',
                'label',
                'file',
                'line',
                'target',
                'group',
                'group.start',
                'group.end',
                'group.title',
                'group.expand',
            ].forEach(function (name) {
                if (typeof meta[name] !== 'undefined') node.meta[name] = meta[name];
            });

            if (typeof node.meta["group.start"] != "undefined") {
                node.value = node.meta["group.title"] || '?';
                node.type = 'string';
            }

            if (VERBOSE) console.log("Decoder.formatMessage() RETURN:", node);

            return node;

            /*
            var id = "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0";
            if (meta.renderer.substring(0, id.length+1) === id + ":") {
            */

        } catch (err) {
            console.error("message", message);
            console.error("node", node);
            throw err;
        }
    }
}

exports.Decoder = Decoder;
