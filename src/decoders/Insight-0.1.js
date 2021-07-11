
const DECODER = require("insight-for-js/lib/decoder/default");

class Decoder {

    formatMessage (message) {

        let meta = (typeof message.meta === "string") ? JSON.parse(message.meta) : message.meta;

        if (meta["lang.id"] === "registry.pinf.org/cadorn.org/github/renderers\/packages\/php\/master") {
            meta["lang"] = "php";
            delete meta["lang.id"];
        } else {
            throw new Error("'lang.id of '" + meta["lang.id"] + "' not supported!");
        }

        let data = JSON.parse(message.data);

        if (!data.origin) {
            throw new Error("No 'data.origin' found in message data");
        }

        Object.keys(data.origin).forEach(function (name) {
            meta[name] = data.origin[name];
        });

        let node = {
            "#": "InsightTree",
            meta: meta,
            type: meta.type,
            value: meta.value
        };
        delete meta.type;
        delete meta.value;
        if (data.instances) {
            node.instances = data.instances;
        }

        return node;
    }
}

exports.Decoder = Decoder;
