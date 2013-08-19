SERVICES['constructor']['widget-manager'] = function(){
	var my = this,
	    renderers = {},
	    handlers = {},
	    containerRenderer = null,
	    widgetsCollection = [];

    this.init = function(){
		return my;
	};

    this.render = function(){
        var container = this.$getContainerRenderer();
        widgetsCollection.forEach(function(w){
            initWidget(w).view.appendTo(container.node.inner.el);
        });
        return container;
    };

    var initWidget = function(widget){
        if(!widget.renderer)
            new ErrorHandler('WidgetManager: Can not find renderer for "' + type  + '" widget type');
        if(!widget.handler)
            new ErrorHandler('WidgetManager: Can not find handler for "' + type  + '" widget type');
        return widget.renderer.init(
            widget.handler.init(
                widget
            )
        );
    };

	var createNewWidget = function(model){
        var type = model.get('type');
		return {
            'eventManager' : model.$getEventManager(),
            'view' : null,
            'shortLinks' : {},
            'manager' : this,
            'renderer' : renderers[type]||null,
            'handler' : handlers[type]||null
        };
	};

    this.addModel = function(model){
        if(widgetsCollection.some(function(w){return w.eventManager.getContext() === model}))
            new ErrorHandler('WidgetManager: added model is already in collection');
        widgetsCollection.push(createNewWidget(model));
        return this;
    };
    this.setContainerRenderer = function(obj){
		containerRenderer = obj;
		return this;
	};
    this.setRenderers = function(obj){
		renders = obj;
		return this;
	};
    this.setHandlers = function(obj){
		handlers = obj;
		return this;
	};
    this.addRenderer = function(obj){
        var tmp = {};
        tmp[obj.getType()] = obj;
		cm.merge(renderers, tmp);
		return this;
	};
    this.addHandler = function(obj){
        var tmp = {};
        tmp[obj.getType()] = obj;
		cm.merge(handlers, tmp);
		return this;
	};
    this.getHandlers = function(){
		return handlers;
	};
    this.getRenders = function(){
		return renders;
	};
    this.getContainerRenderer = function(){
        return containerRenderer;
    };
};