
const WINDOW = window;

const LODASH_MERGE = require("lodash/merge");
const EVENT_EMITTER = require("eventemitter2").EventEmitter2;


// ##################################################
// # Insight Reps
// ##################################################

const REPS = require("insight.domplate.reps");

let repsBaseUrl = "/reps";
if (typeof bundle !== "undefined") {
    repsBaseUrl = bundle.module.filename.replace(/(^|\/)[^\/]+\/[^\/]+$/, '$1dist/insight.domplate.reps');
}

const repLoader = new REPS.Loader({
    repsBaseUrl: repsBaseUrl
});


// ##################################################
// # Message Encoding/Decoding
// ##################################################

const WILDFIRE = require("wildfire-for-js/lib/wildfire");
const BROWSER_API_ENCODER = require("./encoders/BrowserApi-0.1");
const FIREBUG_CONSOLE_DECODER = require("./decoders/FirebugConsole-0.1");

const encoder = new BROWSER_API_ENCODER.Encoder();
const decoder = new FIREBUG_CONSOLE_DECODER.Decoder();

const receiver = WILDFIRE.Receiver();
receiver.setId("http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1");
receiver.addListener({
    onMessageReceived: function (request, message) {
        exports.fireconsole.appendMessage(
            decoder.formatMessage(message)
        );
    }
});

var receiverChannel = WILDFIRE.PostMessageChannel();
receiverChannel.addReceiver(receiver);





function FireConsole () {
    var self = this;

    self.parseReceivedPostMessage = function () {
        return receiverChannel.parseReceivedPostMessage.apply(receiverChannel, arguments);
    }

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
        //var helpers = message.helpers;
        var meta = message.meta;
;debugger;
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
    
                var nodeTree = message.node;//og.getOrigin();
    
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

        const panelEl = options.panelEl || self.getPanelEl();
        if (!panelEl) {
            buffer.push(message);
            return;
        }

        if (options.view === "detail") {
            repRenderer.renderNodeInto(message, panelEl);
        } else {

            if (message["#"] !== "InsightTree") {
                message = encoder.formatMessage(message, options);
            }

            var msg = {
                render: function (el, view, messageObject) {

throw new Error("Render!!");                    
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

                    if (
                        node.type === "reference" ||
                        node.meta.renderer === "structures/table" ||
                        node.meta.renderer === "structures/trace"
                    ) {
                        var tpl = null;
                        if (node.type === "reference") {
throw new Error("Get REFERENCE");                            
                            tpl = commonHelpers.getTemplateModuleForNode(node.instances[0]);                        
                        } else
                        if (
                            node.meta.renderer === "structures/table" ||
                            node.meta.renderer === "structures/trace"                                
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
                meta: message.meta,
                node: message,
                options: {},
//                helpers: helpers,
                //domain: message.domain,
                context: message.context || undefined
            };

            renderSupervisor.appendMessageToNode(panelEl, msg);
        }
    }


    var consoles = {};

    self.consoleForId = function (id) {

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
    }

    self.destroyConsoleForId = function (id) {
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

    const publicAPI = new PublicAPI(self);

    self.getAPI = function () {
        return publicAPI;
    }
}
FireConsole.prototype = Object.create(EVENT_EMITTER.prototype);


class PublicAPI {

    constructor (fireconsole, options) {
        this.fireconsole = fireconsole;
        this.options = options || {};
    }

    clear () {
        return this.fireconsole.clear.apply(this.fireconsole, arguments);
    }
    on () {
        return this.fireconsole.on.apply(this.fireconsole, arguments);
    }
    off () {
        return this.fireconsole.off.apply(this.fireconsole, arguments);
    }

    _logObjectWithPriority (priority, message) {
        this.fireconsole.appendMessage(message, LODASH_MERGE({}, this.options, {
            priority: priority
        }));
    }

    renderMessageInto (panelEl, message) {
        this.fireconsole.appendMessage(message, {
            panelEl: panelEl,
            clear: true,
            view: "detail"
        });
    }

    label (label) {
        return new PublicAPI(this.fireconsole, {
            label: label
        });
    }

    log (message) {
        this._logObjectWithPriority("log", message);
    }
    info (message) {
        this._logObjectWithPriority("info", message);
    }
    warn (message) {
        this._logObjectWithPriority("warn", message);
    }
    error (message) {
        this._logObjectWithPriority("error", message);
    }
    send (message) {
        if (
            message.sender &&
            message.receiver
        ) {
            if (message.receiver === "http://meta.firephp.org/Wildfire/Structure/FirePHP/FirebugConsole/0.1") {
                this.fireconsole.appendMessage(
                    decoder.formatMessage(message)
                );
            } else {
                throw new Error(`Receiver for ID '${message.receiver}' not implemented!`);
            }
            return;
        }
        if (!Array.isArray(message)) {
            message = [
                message
            ];
        }
        this.fireconsole.parseReceivedPostMessage(message);
    }
};


// ##################################################
// # Main
// ##################################################

exports.fireconsole = new FireConsole();

if (typeof WINDOW.FC === "undefined") {
    WINDOW.FC = exports.fireconsole.getAPI();
}

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
                exports.fireconsole.appendMessage(message);
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
            css: (css () >>>

                DIV {
                    font-family: Lucida Grande, Tahoma, sans-serif;
                    font-size: 11px;
                }

            <<<),
            on: {
                mount: function (el) {
                    exports.fireconsole.setPanelElement(el);
                }
            }
        });
    });
};
