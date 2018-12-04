import Channel from "jschannel/src/jschannel";

class PageToolsConnector {
    constructor() {
        this.channel = Channel.build({window: window.parent, origin: "*", scope: "extensionScope"});

        this._init();
    }

    _init() {
        var pageMetaElement = document.querySelector('meta[name="chrome-extension:page-tools"]');

        this.channel.call({
            method: "init",
            params: {
                location: document.location.href,
                toolsUrl: pageMetaElement? pageMetaElement.content : null
            },
            success: function(v) {  }
        });
    }

    on(name, handler) {
        this.channel.bind("event", function(trans, data) {
            if(typeof data == 'object' && data.name == name) {
                handler(data.params || {});
            }
        });
    }

    emit(name, params) {
        this.channel.call({
            method: "event",
            params: {name: name, params: params},
            success: function(v) {  }
        });
    }

    eval(script, handler) {
        this.channel.call({
            method: "eval",
            params: script,
            success: function(response) {
                if(typeof handler == 'function') {
                    handler(response);
                }
            }
        });
    }
}

export default PageToolsConnector;