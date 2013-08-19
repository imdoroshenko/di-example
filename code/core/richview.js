SERVICES['constructor']['rich-view'] = function(url){
    "use strict";
    var my = this;
    this.root = document.createDocumentFragment();
    this.em = null;
    this.directives = {};
    this.filters = {};
    this.node = {};
    this.attrPrefix = 'rv-';
    this.loaded = false;
    this.elements = [];
    this.url = '';
    /*RE*/
    this.reCheck = new RegExp('^(data-)?'+this.attrPrefix+'.+', 'i');
    this.reReplace = new RegExp('^(data-)?'+this.attrPrefix, 'i');
    this.reSplitComma = /\s?;\s?/;
    this.reSplitColon = /\s?:\s?/;
    this.reSplitBar = /\s?\|\s?/;
    this.reFunction = /([a-z0-9_\-\.]*)(?:\((.*)\))?/i;

    this.template = function(url){
        this.setUrl(url);
        this.loadTemplate();
        return this;
    };
    this.loadTemplate = function(){
        var my = this;
        this.loaded = false;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.url, false);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    var dom = new DOMParser().
                        parseFromString(xhr.responseText, "text/html").body;
                    my.elements = [];
                    for(var ln = dom.childNodes.length; ln-- > 0;){
                        my.elements[ln] = dom.childNodes[ln];
                    }
                    my.bindNodes(my.initNodes(dom));
                    my.groupElements();
                    my.loaded = true;
                    my.em.triggerEvent('ready');
                }else{
                    throw new Error('Template request failed with status ' + xhr.status);
                }
            }
        };
        xhr.send(null);
        return this;
    };
    this.initNodes = function(root, initRoot){
        var nodes = [];
        if(initRoot && root.nodeType === 1){
            nodes.push(this.elementToNode(root));
        }
        var els = root.getElementsByTagName('*');
        for(var ln = els.length; ln-- > 0;){
            nodes.push(this.elementToNode(els[ln]));
        }
        return nodes;
    };
    this.elementToNode = function(el){
        var name = this.getAttribute(el, 'node'),
            attrs = el.attributes,
            metaDirectives = [],
            directives = {};

        for(var ln = attrs.length; ln-- > 0;){
            var attr = attrs.item(ln);
            if(this.reCheck.test(attr.nodeName))
                metaDirectives.push(attr);
        }
        for(var ln = metaDirectives.length; ln-- > 0;){
            var attrName = metaDirectives[ln].nodeName;
            directives[attrName.replace(this.reReplace, '')] = metaDirectives[ln].nodeValue;
        }
        return el.__rv__ = {
            el: el,
            directives : directives,
            name: name
        };
    };
    this.cloneNode = function(node){
        var clone = node.el.cloneNode(true);
        this.bindNodes(this.initNodes(clone, true));
        return clone.__rv__;
    };
    this.bindNodes = function(nodes){
        for(var ln = nodes.length; ln-- > 0;){
            this.applyDirectives(nodes[ln]);
        }
    };
    this.applyDirectives = function(node){
        this.directives._base.call(this, node);
        for(var directive in node.directives){
            if(this.directives[directive])
                this.directives[directive].call(this, node, node.directives[directive]);
        }
        return node;
    };
    this.appendTo = function(node){
        if(this.root.nodeType !== 11){
            this.groupElements();
        }
        node.appendChild(this.root);
        this.root = node;
        this.em.triggerEvent('appended');
        return this;
    };
    this.getElementNode = function(el){
        return el.__rv__;
    };
    this.applyModel = function(node, model, deep){
        node.model = model;
        if(node.directives['model-prop']){
            var statement = this.parseStatement(node.directives['model-prop'])[0],
                property = statement? statement.property : undefined,
                value = this.extract(property, model);
            if(statement.filter && this.filters[statement.filter])
                value = this.filters[statement.filter](value, node);
            while(node.el.firstChild){ node.el.removeChild(node.el.firstChild);}
            if(value)
                node.el.appendChild(document.createTextNode(value));
        }
        if(deep === true){
            var childNodes = this.getByAttribute('model-prop', node.el);
            for(var ln = childNodes.length; ln-- > 0;){
                this.getElementNode(childNodes[ln]).applyModel(model, false);
            }
        }
        return this;
    };
    this.groupElements = function(){
        this.root = document.createDocumentFragment();
        for(var i = 0, ln = this.elements.length; i < ln; i++){
            this.root.appendChild(this.elements[i]);
        }
        return this;
    };
    this.getByAttribute = function(attr, root){
        root = root||this.root;
        return root.querySelectorAll('[data-'+this.attrPrefix+attr+'],['+this.attrPrefix+attr+']');
    };
    this.getAttribute = function(node, attr){
        attr = this.hasAttribute(node, attr);
        return attr? node.getAttribute(attr) : false;
    };
    this.hasAttribute = function(node, attr){
        attr = this.attrPrefix.concat(attr);
        if(node.hasAttribute('data-' + attr))
            return 'data-' + attr;
        if(node.hasAttribute(attr))
            return attr;
        return false;
    };
    this.onReady = function(callback){
        var listener = [this, function(){
            this.em.removeListener('ready', listener);
            callback.call(this);
        }];
        return this.loaded? callback.call(this) : this.em.addListener('ready', listener), this;
    };
    this.extract = function(str, context, invoke){
        if(!str)
            return str;
        var target = context||window,
            levels = str.split('.'),
            re = /.+\(.*\)/;
        for(var i = 0; target !== undefined && levels[i];i++){
            if(re.test(levels[i])){
                var functStatement = this.parseFunction(levels[i]);
                if((i < levels.length - 1) || invoke)
                    target = target[functStatement.name].apply(target, functStatement.args);
            }else{
                target = target[levels[i]];
            }
        }
        return target;
    };
    this.parseFunction = function(str){
        var parts = str.match(this.reFunction);
        if(!parts)
            return { name : '', args : undefined};
        var my = this;
        return {
            name : parts[1]||'',
            args : parts[2] == undefined? undefined : parts[2].split(my.reSplitComma)
        };
    };
    this.parseStatement = function(str){
        if(!str)
            return [];
        var statements = str.split(this.reSplitComma);
        for(var i = 0, ln = statements.length; i < ln; i++){
            var statement = statements[i],
                prefix = null,
                property = null,
                filter = null,
                particals = statement.split(this.reSplitColon);
            if(particals.length >= 2)
                prefix = particals.shift();
            particals = particals.join(':').split(this.reSplitBar);
            if(particals.length >= 2)
                filter = particals.pop();
            property = particals.join('|')||null;
            statements[i] = {
                filter : filter,
                property : property,
                prefix : prefix
            };
        }
        return statements;
    };
    /*directives*/
    this.directives._base = function(node){
        node.applyModel = function(model, deep){
            my.applyModel(this, model, deep);
            return this;
        };
        var my = this;
        node.getModel = function(){
            var current = node;
            while(!current.model){
                if(current.el.parentNode && (current = my.getElementNode(current.el.parentNode)))
                    continue;
                return undefined;
            }
            return current.model;
        }
    };
    this.directives.event = function(node, property){
        var statements = this.parseStatement(property);
        for(var i = 0, ln = statements.length; i < ln; i++){
            var functStatement = this.parseFunction(statements[i].property);
            (function lambda(eventName, triggerName, triggerArgs){
                node.el.addEventListener(eventName, function (e){
                    my.em.triggerEvent(triggerName, {
                        node : node,
                        args : triggerArgs,
                        model : node.getModel(node),
                        event : e || null
                    })
                }, false);
            })(statements[i].prefix,
                    functStatement.name,
                    functStatement.args);
        }
    };
    this.directives.node = function(node){
        var my = this;
        my.node[node.name] = node;
    };
    this.directives.repeat = function(node){
        var my = this;
        node.repeatMarker = document.createComment('repeat marker for ' + node.name);
        node.el.parentNode.replaceChild(node.repeatMarker, node.el);
        node.el.removeAttribute(this.hasAttribute(node.el, 'repeat'));
        node.el.removeAttribute(this.hasAttribute(node.el, 'node'));
        node.repeatStack = [];
        node._getNodeByModel = function(model){
            for(var ln = this.repeatStack.length; ln-- > 0;){
                if(this.repeatStack[ln].model === model)
                    return this.repeatStack[ln];
            }
            return undefined;
        };
        node.clear = function(){
            var parent = node.repeatMarker.parentNode;
            for(var ln = node.repeatStack.length; ln-- > 0;){
                parent.removeChild(node.repeatStack[ln].el);
            }
            node.repeatStack = [];
            return node;
        };
        node.create = function(){
            return my.cloneNode(node);
        };
        node.setCollection = function(collection){
            this._collection = collection;
            return this;
        };
        node.displayCollection = function(collection){
            this._collection = collection||this._collection;
            var df = document.createDocumentFragment(),
                repeatStack = [];
            for(var i = 0, ln = this._collection.length; i < ln; i++){
                var node = this._getNodeByModel(this._collection[i])||this.create().applyModel(this._collection[i], true);
                repeatStack.push(node);
                df.appendChild(node.el);
            }
            this.repeatMarker.parentNode.appendChild(df, this.repeatMarker);
            this.repeatStack = repeatStack;
            return this;
        };
        this.directives.display = function(node, property){
            node.toggle = function(){
                if(node.el.style.display != 'none')
                    node.hide();
                else
                    node.show();
            };
            node.show = function(){node.el.style.display = 'block';};
            node.hide = function(){node.el.style.display = 'none';};
            if(property && ['show', 'hide'].indexOf(property) > -1)
                node[property]();
        };
    };
    /*/directives*/
    this.setEventManager = function(em){this.em = em; return this;};
    this.setUrl = function(url){this.url = url;return this};
    this.querySelector = function(selector){return this.root.querySelector(selector);};
    this.querySelectorAll = function(selector){return this.root.querySelectorAll(selector);};
};
(function(DOMParser) {
    "use strict";
    var
        DOMParser_proto = DOMParser.prototype
        , real_parseFromString = DOMParser_proto.parseFromString
        ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}
    DOMParser_proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var
                doc = document.implementation.createHTMLDocument("")
                ;
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup;
            }
            else {
                doc.body.innerHTML = markup;
            }
            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));