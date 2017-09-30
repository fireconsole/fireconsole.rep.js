(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var WINDOW = window;

function Fireconsole() {
    var self = this;

    var panelEl = null;
    self.setPanelElement = function (el) {
        panelEl = el;
        flushBuffer();
    };

    var buffer = [];
    function flushBuffer() {
        if (!buffer.length || !panelEl) return;
        buffer.map(self.appendMessage);
        buffer = [];
    }

    self.appendMessage = function (message) {
        if (!panelEl) {
            buffer.push(message);
            return;
        }
        var el = WINDOW.document.createElement("div");
        el.innerHTML = JSON.stringify(message, null, 4);
        panelEl.appendChild(el);
    };

    self.getAPI = function () {
        return {
            log: function log(message) {

                // TODO: Render message.

                self.appendMessage(message);
            }
        };
    };
}

var fireconsole = new Fireconsole();
var FC = WINDOW.FC = fireconsole.getAPI();

exports.main = function (JSONREP, node) {

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

    return JSONREP.makeRep('<div class="console.panel">' + '</div>', {
        on: {
            mount: function mount(el) {

                fireconsole.setPanelElement(el);
            }
        }
    });
};

},{}]},{},[1]);
