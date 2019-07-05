
const VERBOSE = true;

const ENCODER = require("insight-for-js/lib/encoder/default");


var encoder = ENCODER.Encoder();
encoder.setOption("maxObjectDepth", 1000);
encoder.setOption("maxArrayDepth", 1000);
encoder.setOption("maxOverallDepth", 1000);


class Encoder {

    formatMessage (message, options) {

        const node = {
            "#": "InsightTree",
            "meta": {}
        };

        try {

            if (VERBOSE) console.log("Encoder.formatMessage():", message);

            const dataNode = encoder.encode(message, {
            }, {
                "jsonEncode": false
            });

            node.meta = dataNode.origin.meta;
            node.type = dataNode.origin.type || undefined;
            node.value = dataNode.origin.value;

            if (options.priority) {
                node.meta.priority = options.priority;
            }
            if (options.label) {
                node.meta.label = options.label;
            }

            if (VERBOSE) console.log("Encoder.formatMessage() RETURN:", node);

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

exports.Encoder = Encoder;
