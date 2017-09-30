
const WINDOW = window;

function Fireconsole () {
    var self = this;

    var panelEl = null;
    self.setPanelElement = function (el) {
        panelEl = el;
        flushBuffer();
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
    

    self.appendMessage = function (message) {
        if (!panelEl) {
            buffer.push(message);
            return;
        }
        var el = WINDOW.document.createElement("div");
        el.innerHTML = JSON.stringify(message, null, 4);
        panelEl.appendChild(el);        
    }


    self.getAPI = function () {
        return {
            log: function (message) {

                // TODO: Render message.

                self.appendMessage(message);
            }
        };
    }
}

const fireconsole = new Fireconsole();
const FC = WINDOW.FC = fireconsole.getAPI();


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

    return JSONREP.makeRep(
        (
            '<div class="console.panel">' + 
            '</div>'
        ),
        {
            on: {
                mount: function (el) {

                    fireconsole.setPanelElement(el);
                }
            }
        }
    );
};
