
const WINDOW = window;

const EVENT_EMITTER = require("eventemitter2").EventEmitter2;
const WILDFIRE = require("wildfire-for-js/lib/wildfire");

const REPS = require("insight.domplate.reps");
const ENCODER = require("insight-for-js/lib/encoder/default");
const DECODER = require("insight-for-js/lib/decoder/default");


//console.log("bundle", bundle);

var repsBaseUrl = "/reps";
if (typeof bundle !== "undefined") {
    repsBaseUrl = bundle.module.filename.replace(/(^|\/)[^\/]+\/[^\/]+$/, '/dist/insight.domplate.reps');
}

//console.log("repsBaseUrl", repsBaseUrl);


var repLoader = new REPS.Loader({
    repsBaseUrl: repsBaseUrl
});

/*
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
    getTemplateModuleForNode: function (node) {

//console.log("getTemplateModuleForNode", node);
//;debugger;
        var found = null;

        var og = node.og || node.getObjectGraph(),
            ogNode = og.origin,
            meta = og.meta;

        // Match message-based renderers
        if (node === ogNode && meta && meta.renderer) {
            if (!node.meta) node.meta = {};
            var pack = false;
            var id = "http://registry.pinf.org/cadorn.org/renderers/packages/insight/0";
            if (meta.renderer.substring(0, id.length+1) === id + ":") {
                if (node === node.getObjectGraph().getOrigin()) {
                    node.meta.renderer = meta.renderer.substring(id.length+1);
                }
                pack = "insight";
            }
            if (pack) {
                found = templatePacks.byid[pack].getTemplateForNode(node);
            } else {
                console.warn("Unknown renderer: " + meta.renderer);
            }
        }

        // Match message-based language primitives
        if (!found && meta && meta["lang.id"]) {
            if (meta["lang.id"] == "registry.pinf.org/cadorn.org/github/renderers/packages/php/master") {
                found = templatePacks.byid["php"].getTemplateForNode(node);
                if (!found) {
                    // lookup in default language pack
                    found = templatePacks.byid["insight"].getTemplateForNode(node);
                }
            } else {
                throw new Error("Unknown language ID: " + meta["lang.id"]);
            }
        } else
        if (!found) {
//console.log("getTemplateModuleForNode() - !found");
            for (var i=templatePacks.list.length-1 ; i>=0 ; i--) {
                if (
                    typeof templatePacks.list[i].getTemplateForNode == "function" &&
                    (found = templatePacks.list[i].getTemplateForNode(node))
                ) {
                    break;
                }
            }
        }
        if (!found) {
            console.error("ERROR: Template for node '" + node.type + "' not found! (in " + module.id + ")", node);
            return false;
        }
        return found;
    },
    getTemplateForNode: function (node) {
        if (!node) {
            throw new Error("No node specified!");
        }
//console.log("getTemplateForNode", node);

        var template = commonHelpers.getTemplateModuleForNode(node);

//        "lang.id":"registry.pinf.org/cadorn.org/github/renderers/packages/php/master"

//        var template = INSIGHT_RENDERERS.getTemplateForNode(node).getTemplate(this.helpers);
        return template.getTemplate(this.helpers);
    },
    getResourceBaseUrl: function (module) {

        // TODO: Optionally specify different URL
        return "dist/resources/insight.renderers.default/";
    },
    document: window.document,
    logger: window.console
};
commonHelpers.util.merge = UTIL.merge;
*/

var commonHelpers = {};



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




function FireConsole () {
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
        }
/*
         else {
            var el = WINDOW.document.createElement("div");
            el.setAttribute("class", "message");        
    //        el.innerHTML = JSON.stringify(message, null, 4);
            panelEl.appendChild(el);        
                
        }
*/

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



        new Promise(function (resolve, reject) {

            if (domNode) {
    //;debugger;            
    //            message.template = helpers.getTemplateForNode(message.og.origin);
    
    //            CONSOLE_WRAPPER.renderMessage(message, domNode, options, helpers);
    
                var nodeTree = message.og.getOrigin();
    
                nodeTree.meta = nodeTree.meta || {};
                nodeTree.meta.wrapper = 'wrappers/console';
    
                repRenderer.renderNodeInto(nodeTree, domNode).then(resolve, reject);
            } else {
                resolve();
            }
                
        }).then(function () {


            // post render

            // TODO: Relocate all this into domNode.templateObject.postRender();
            if (typeof meta["group.start"] !== "undefined") {
                
                // get reference to body of last added console row
                var node = repLoader.domplate.util.getElementByClass(domNode, "body");

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
                var node = repLoader.domplate.util.getElementByClass(domNode, "body");
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
                var node = repLoader.domplate.util.getElementByClass(domNode, "actions");
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
        }).catch(function (err) {
            throw err;
        });
    }


    self.getPanelEl = function () {
        return panelEl;
    }

    self.clear = function (options) {
        options = options || {};
        var panelEl = options.panelEl || self.getPanelEl();
        panelEl.innerHTML = "";        
    }

    self.hide = function () {
        self.getPanelEl().style.display = "none";
    }
    self.show = function () {
        self.getPanelEl().style.display = "";
    }
    self.isShowing = function () {
        // TODO: Make this more reliable.
        return (self.getPanelEl().style.display === "");
    }
    self.destroy = function () {
    }


    var buffer = [];
    function flushBuffer () {
        if (
            !buffer.length ||
            !panelEl
        ) return;
        buffer.map(function (message) {
            self.appendMessage(message);
        });
        buffer = [];
    }

	var renderSupervisor = new Supervisor();


    var repRenderer = new REPS.Renderer({
        loader: repLoader,
        onEvent: function (name, args) {
    
console.log('repRenderer.onEvent()', name, args);

            if (name === "click") {
                //self.emit("clickRow", context);
            } else
            if (name === "expand") {
                //self.emit("expandRow", context);
            } else
            if (name === "contract") {
                //self.emit("contractRow", context);
            } else
            if (name === "inspectMessage") {
                self.emit(name, {
                    message: args[1].message
                });
            } else
            if (name === "inspectFile") {
/*
                var context = UTIL.copy(args[1].args);
                context.message = args[1].message;
                self.emit(name, context);
*/
            } else
            if (name === "inspectNode") {
                self.emit(name, {
                    message: {
                        node: args[1].args.node,
                        template: helpers.getTemplateForNode(args[1].args.node)
                    }
                });
            } else {
                console.error("No handler for: repRenderer.onEvent()", name, args);
                throw new Error("NYI");
            }
        }
    });
    

    self.appendMessage = function (message, options) {

        options = options || {};

        if (options.clear) {
            self.clear(options);
        }

        var panelEl = options.panelEl || self.getPanelEl();
        
        if (!panelEl) {
            buffer.push(message);
            return;
        }
/*
        var helpers = Object.create(commonHelpers);
        helpers.helpers = helpers;
        helpers.debug = false;
        helpers.dispatchEvent = function (name, args) {

            if (name === "expand") {
                //self.emit("expandRow", context);
            } else
            if (name === "contract") {
                //self.emit("contractRow", context);
            } else
            if (name === "inspectMessage") {
                self.emit(name, {
                    message: args[1].message
                });
            } else
            if (name === "inspectFile") {
                var context = UTIL.copy(args[1].args);
                context.message = args[1].message;
                self.emit(name, context);
            } else
            if (name === "inspectNode") {
                self.emit(name, {
                    message: {
                        node: args[1].args.node,
                        template: helpers.getTemplateForNode(args[1].args.node)
                    }
                });
            } else {
                console.error("helpers.dispatchEvent()", name, args);
                throw new Error("NYI");
            }
        };
*/

        if (options.view === "detail") {
/*
            VIEWER_WRAPPER.renderMessage(message, panelEl, {
                view: [
                    "detail"
                ]
            }, helpers);
*/
            repRenderer.renderNodeInto(message, panelEl);

        } else {

            var og = null;
            var meta = null;
    
            if (
                typeof message === "object" &&
                typeof message.og !== "undefined"
            ) {
                meta = message.meta;
                og = message.og;
            } else {
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
            }

            //console.log("META", meta);

            var node = og.getOrigin();

            //console.log("NODE", node);
            /*
                    var template = PHP_RENDERERS.getTemplateForNode(node);

                    if (!template) {
                        template = INSIGHT_RENDERERS.getTemplateForNode(node);
                    }
                    
            console.log("template!!!", template);
            if (!template) {
                console.log("NO template for message", message, node)
            }
            */

            var msg = {
                render: function (el, view, messageObject) {

                    // Nothing to render for groups. Child nodes have already been inserted.
                    // TODO: Maybe do not insert child nodes until expanding?
                    if (typeof meta["group.start"] !== "undefined" && meta["group.start"]) {
                        return;
                    }

                    var options = {};
                    if (view) {
                        options.view = view;
                    }
                    if (typeof options.view !== "array") {
                        options.view = [ options.view ];
                    }

                    // HACK
                    var _og = og;
                    if (
                        _og.origin.type === "reference" ||
                        _og.origin.meta.renderer === "structures/table" ||
                        _og.origin.meta.renderer === "structures/trace"
                    ) {
                        var tpl = null;
                        if (_og.origin.type === "reference") {
                            tpl = commonHelpers.getTemplateModuleForNode(_og.instances[0]);                        
                        } else
                        if (
                            _og.origin.meta.renderer === "structures/table" ||
                            _og.origin.meta.renderer === "structures/trace"                                
                        ) {
                            tpl = commonHelpers.getTemplateModuleForNode(_og.origin);                        
                        }                        
                        var tplDec = tpl.getTemplateDeclaration();
                        if (tplDec.VAR_hideShortTagOnExpand === false) {
                            messageObject.postRender.keeptitle = true;
                        }
                    }
                    //;debugger;
//getTemplateForNode

//console.log("RENDER:::", node, el);
                    //var template = helpers.getTemplateModuleForNode(node);
//                    var tpl = template.getTemplateDeclaration();
                    /*                    
                    var rawTpl = template.getTemplate(helpers).getRawTemplate();
                    if (rawTpl.VAR_hideShortTagOnExpand === false) {
                        messageObject.postRender.keeptitle = true;
                    }
*/
//                    template.renderObjectGraphToNode(node, el, options, helpers);
                },
                template: null,//template.getTemplate(helpers),
                meta: meta,
                og: og,
                options: {},
//                helpers: helpers,
                //domain: message.domain,
                context: message.context
            };

            renderSupervisor.appendMessageToNode(panelEl, msg);
        }

/*
        template.renderObjectGraphToNode(node, el, {
            view: [
                "summary"
            ]
        }, helpers);
*/
    }


    var consoles = {};

    var publicAPI = {
        renderMessageInto: function (panelEl, message) {
            self.appendMessage(message, {
                panelEl: panelEl,
                clear: true,
                view: "detail"
            });
        },
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
        },
        clear: self.clear.bind(self),
        on: self.on.bind(self),
        off: self.off.bind(self),
        consoleForId: function (id) {

            var el = panelEl.querySelector('DIV[fireconsoleid="' + id + '"]');
            if (!el) {
                el = WINDOW.document.createElement('div');
                el.setAttribute("fireconsoleid", id);
                panelEl.appendChild(el);
            }
            if (!consoles[id]) {
                consoles[id] = new FireConsole();
                consoles[id].setPanelElement(el);
                consoles[id].onAny(function () {
                    self.emit.apply(self, arguments);
                });
            }
            return consoles[id];
        },
        destroyConsoleForId: function (id) {
            if (!consoles[id]) {
                return;
            }
            consoles[id].destroy();
            delete consoles[id];
            var el = panelEl.querySelector('DIV[fireconsoleid="' + id + '"]');
            if (el) {
                el.parentNode.removeChild(el);
            }
        }
    };

    self.getAPI = function () {
        return publicAPI;
    }
}
FireConsole.prototype = Object.create(EVENT_EMITTER.prototype);


const fireconsole = new FireConsole();
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
            node.messages.map(function (message) {
                fireconsole.appendMessage(message);
            });
        }

        if (node.load) {
            node.load.map(function (uri) {
                var script = WINDOW.document.createElement('script');
                script.type = 'text/javascript';
                script.src = uri;
                WINDOW.document.getElementsByTagName('head')[0].appendChild(script);    
            });
        }

        return JSONREP.makeRep('<div></div>', {
            on: {
                mount: function (el) {

                    fireconsole.setPanelElement(el);
                }
            }
        });
    });
};
