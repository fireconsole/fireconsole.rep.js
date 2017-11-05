
const WINDOW = window;

const EVENT_EMITTER = require("eventemitter2").EventEmitter2;
const WILDFIRE = require("wildfire-for-js/lib/wildfire");
const RENDERERS = require("insight.renderers.default/lib/insight/pack");
const CONSOLE_WRAPPER = require("insight.renderers.default/lib/insight/wrappers/console");
const ENCODER = require("insight-for-js/lib/encoder/default");
const DECODER = require("insight-for-js/lib/decoder/default");
const DOMPLATE_UTIL = require("domplate/lib/util");
const UTIL = {
    copy: require("lodash/clone"),
    merge: require("lodash/merge"),
    importCssString:  function(cssText, doc, id) {
        doc = doc || document;
        
        if (typeof id !== "undefined") {
            if (doc.getElementById(id)) {
                return;
            }
        }

        if (doc.createStyleSheet) {
            var sheet = doc.createStyleSheet();
            sheet.cssText = cssText;
        } else {
            var style = doc.createElementNS ?
                        doc.createElementNS("http://www.w3.org/1999/xhtml", "style") :
                        doc.createElement("style");
            if (typeof id !== "undefined") {
                style.setAttribute("id", id);
            }
            style.appendChild(doc.createTextNode(cssText));

            var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
            head.appendChild(style);
        }
    }
};

var commonHelpers = {
    helpers: null,
    // NOTE: This should only be called once or with an ID to replace existing
    importCssString: function(id, css, document) {
        UTIL.importCssString([
            '[renderer="jsonrep"] {',
            '   font-family: Lucida Grande, Tahoma, sans-serif;',
            '   font-size: 11px;',
            '}',
            css
        ].join("\n"), document, "devcomp-insight-css-" + id);
    },
    util: UTIL.copy(DOMPLATE_UTIL),
    getTemplateForId: function(id) {
        throw new Error("NYI - commonHelpers.getTemplateForid (in " + module.id + ")");
    },
    getTemplateForNode: function (node) {
        if (!node) {
            throw new Error("No node specified!");
        }
        var template = RENDERERS.getTemplateForNode(node).getTemplate(this.helpers);
        return template;
    },
    getResourceBaseUrl: function (module) {

        // TODO: Optionally specify different URL
        return "dist/resources/insight.renderers.default/";
    },
    document: window.document,
    logger: window.console
};
commonHelpers.util.merge = UTIL.merge;


var encoder = ENCODER.Encoder();



var receiver = WILDFIRE.Receiver();
receiver.setId("http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1");
receiver.addListener({
    onMessageReceived: function (request, message) {


//console.log("MESSAGE:::", message);

        fireconsole.appendMessage(message);

    }
});

var receiverChannel = WILDFIRE.PostMessageChannel();
receiverChannel.addReceiver(receiver);




function Fireconsole () {
    var self = this;

    var panelEl = null;
    self.setPanelElement = function (el) {
        panelEl = el;
        flushBuffer();
    }



    var Supervisor = exports.Supervisor = function() {
        this.groupStack = [];
        this._appendMessageToNode__queue = false;
        this.on = {};
    };
    Supervisor.prototype.ensureCssForDocument = function (document) {

console.error("Supervisor.prototype.ensureCssForDocument", document);

    }
    Supervisor.prototype.resetGroupStack = function() {
        this.groupStack = [];
    }
    Supervisor.prototype.appendMessageToNode = function(domNode, message) {
        if (this._appendMessageToNode__queue === false)
        {
            this._appendMessageToNode__queue = [];
            doSynchronizedappendMessageToNode(this, domNode, message);
        }
        else
        if (this._appendMessageToNode__queue !== false)
            this._appendMessageToNode__queue.push([domNode, message]);
    }



    function doSynchronizedappendMessageToNode (supervisor, panelEl, message) {

        if (supervisor.groupStack.length>0) {
            panelEl = supervisor.groupStack[supervisor.groupStack.length-1];
            if (!panelEl) {
                throw new Error("panelEl is null!");
            }
        } else {
            var el = WINDOW.document.createElement("div");
            el.setAttribute("class", "message");        
    //        el.innerHTML = JSON.stringify(message, null, 4);
            panelEl.appendChild(el);        
                
        }

        var options = message.options;
        var helpers = message.helpers;
        var meta = message.meta;

        var domNode = null;

        if (typeof meta["group.end"] === "undefined") {

            domNode = WINDOW.document.createElement("div");
            domNode.setAttribute("class", "message");        
    //        el.innerHTML = JSON.stringify(message, null, 4);
            panelEl.appendChild(domNode);
        }

        if (domNode) {

            CONSOLE_WRAPPER.renderMessage(message, domNode, options, helpers);
        }

        // post render

        // TODO: Relocate all this into domNode.templateObject.postRender();
        if (typeof meta["group.start"] !== "undefined") {
            
            // get reference to body of last added console row
            var node = DOMPLATE_UTIL.getElementByClass(domNode, "body");

            // insert further messages into group
            supervisor.groupStack.push(node);
            // expand group if requested
            if (
                typeof meta["group.expand"] &&
                meta["group.expand"] === meta["group"] &&
                node.parentNode
            ) {
                node.parentNode.setAttribute("expanded", "true");
            }
        }
        if (typeof meta["group.end"] !== "undefined") {

            var count = meta["group.end"];
            if (count === true) {
                count = 1;
            }
            for( var i=0 ; i<count ; i++ ) {
                var groupStartNode = supervisor.groupStack.pop();
                if (groupStartNode.parentNode.templateObject) {
                    groupStartNode.parentNode.templateObject.setCount(
                        groupStartNode.parentNode,
                        groupStartNode.children.length
                    );
                }
            }
            
        }
        if (meta["expand"]) {
            var node = DOMPLATE_UTIL.getElementByClass(domNode, "body");
            if (
                node.parentNode &&
                node.parentNode.templateObject
            ) {
                node.parentNode.templateObject.expandForMasterRow(node.parentNode, node);
            } else {
                console.error("NYI - expand for message - in " + module.id);
            }
        }
        if (meta["actions"] === false) {
            var node = DOMPLATE_UTIL.getElementByClass(domNode, "actions");
            if (node) {
                node.style.display = "none";
            }
        }

        try {
            if (
                domNode &&
                domNode.children[0] &&
                domNode.children[0].templateObject &&
                domNode.children[0].templateObject.postRender
            ) {
                domNode.children[0].templateObject.postRender(domNode.children[0]);
            }
        } catch(e) {
            console.warn("Error during template postRender", e, e.stack);
        }

        if (supervisor._appendMessageToNode__queue.length > 0) {
            doSynchronizedappendMessageToNode.apply(null, [
                supervisor
            ].concat(supervisor._appendMessageToNode__queue.shift()));
        } else {
            supervisor._appendMessageToNode__queue = false;
        }            
    }




    var buffer = [];
    function flushBuffer () {
        if (
            !buffer.length ||
            !panelEl
        ) return;
        buffer.map(self.appendMessage);
        buffer = [];
    }

	var renderSupervisor = new Supervisor();

    self.appendMessage = function (message) {
        if (!panelEl) {
            buffer.push(message);
            return;
        }

        var og = null;
        var meta = null;

        if (
            typeof message === "object" &&
            typeof message.getMeta === "function"
        ) {
            var obj = DECODER.generateFromMessage(message, DECODER.EXTENDED);
            meta = obj.getMeta() || {};
            og = obj;
        } else {
            var obj = null;                
            if (
                typeof message === "object" &&
                message.sender &&
                message.receiver &&
                typeof message.meta === "string" &&
                typeof message.data === "string"
            ) {
                obj = DECODER.generateFromMessage({
                    meta: JSON.parse(message.meta || "{}") || {},
                    data: message.data
                }, DECODER.EXTENDED);
            } else {
                obj = DECODER.generateFromMessage({
                    meta: meta || {},
                    data: encoder.encode(message, {}, {})
                }, DECODER.EXTENDED);
            }
            meta = obj.getMeta() || {};
            og = obj;
        }

        var helpers = Object.create(commonHelpers);
        helpers.helpers = helpers;
        helpers.debug = false;
        helpers.dispatchEvent = function (name, args) {

            var context = {
                meta: args[1].args,
                message: args[1].message
            };
            if (name === "expand") {
                //self.emit("expandRow", context);
            } else
            if (name === "contract") {
                //self.emit("contractRow", context);
            } else
            if (
                name === "inspectMessage" ||
                name === "inspectFile"                
            ) {
                self.emit(name, context);
            } else {
                console.error("helpers.dispatchEvent()", name, args);
                throw new Error("NYI");
            }
        };

//console.log("META", meta);

        var node = og.getOrigin();

//console.log("NODE", node);
        
        var template = RENDERERS.getTemplateForNode(node);

//console.log("template!!!", template);

        var options = {};

        var msg = {
            render: function (el, view) {

                // Nothing to render for groups. Child nodes have already been inserted.
                // TODO: Maybe do not insert child nodes until expanding?
                if (typeof meta["group.start"] !== "undefined" && meta["group.start"]) {
                    return;
                }

                options = UTIL.copy(options);
                if (typeof view != "undefined") {
                    options.view = view;
                }
                if (typeof options.view != "array") {
                    options.view = [options.view];

                    template.renderObjectGraphToNode(node, el, options, helpers);
                } else {
                    throw new Error("NYI");
                }
            },
            template: template.getTemplate(helpers),
            meta: meta,
            og: og,
            options: options,
            helpers: helpers
        };



        renderSupervisor.appendMessageToNode(panelEl, msg);
    

/*
        template.renderObjectGraphToNode(node, el, {
            view: [
                "summary"
            ]
        }, helpers);
*/
    }


    self.getAPI = function () {
        return {
            log: function (message) {

                // TODO: Render message.

                self.appendMessage(message);
            },
            send: function (message) {

                if (!Array.isArray(message)) {
                    message = [
                        message
                    ];
                }

                receiverChannel.parseReceivedPostMessage(message);       
            }
        };
    }
}
Fireconsole.prototype = Object.create(EVENT_EMITTER.prototype);


const fireconsole = new Fireconsole();
const FC = WINDOW.FC = fireconsole.getAPI();


exports.main = function (JSONREP, node) {

    return Promise.all(Object.keys(node.plugins || []).map(function (key) {
        var panelNode = {};
        panelNode[key] = node[key];
        return JSONREP.markupNode(panelNode).then(function () {
            return null;
        });
    })).then(function () {

        if (node.messages) {
            node.messages.map(fireconsole.appendMessage);
        }

        if (node.load) {
            node.load.map(function (uri) {
                var script = WINDOW.document.createElement('script');
                script.type = 'text/javascript';
                script.src = uri;
                WINDOW.document.getElementsByTagName('head')[0].appendChild(script);    
            });
        }

        return JSONREP.makeRep(
            [
                '<div class="console-container">',
                    '<div class="console-panel"></div>',
                '</div>'
            ].join("\n"),
            {
                on: {
                    mount: function (el) {

                        fireconsole.setPanelElement(el.querySelector("DIV.console-panel"));
                    }
                }
            }
        );
    });
};
