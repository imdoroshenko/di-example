var TextToolsHandler = function(){
	var my = this;
    var iFocus = function(e){
        //ios hack
        document.body.addEventListener('touchstart', (function(target){
            var tmp = function(){
                target.blur();
                document.body.removeEventListener('touchstart', tmp);
            };
            return tmp;
        })(e.params.node.el));
    };
	var limitReached = function(o){
        var currentValue = o.context.get('value');
		if(o.context.state.lastTextValue && currentValue !== o.context.state.lastTextValue){
			return o.context.set('value', o.context.state.lastTextValue);

        }else if(!currentValue){
            return false;
        }
        o.context.state.lastTextValue = (currentValue && currentValue.length)
            ? currentValue.split('').slice(0, -1).join('')
            : '';
        o.context.set('value', o.context.state.lastTextValue);
	};

	var inputHandler = function(e){
		if(e.context.state.limit && e.context.get('value').length < e.params.target.value.length)
			return e.context.triggerObserver();
		e.context.state.lastTextValue = e.context.get('value');
		e.context.set('value', e.params.node.el.value);
	};

    var textStyle = function(e){
        var name = e.params.args[0];
        if(name && (['bold', 'underline', 'italic']).indexOf(name) !== null)
            e.context.set(name, !e.context.get(name));

    };

    var alignY = function(e){
        var name = e.params.args[0];
        if(name && (['b', 'm', 't']).indexOf(name) !== null)
            e.context.set('align-y', name);
    };

    var alignX = function(e){
        var name = e.params.args[0];
        if(name && (['l', 'c', 'r']).indexOf(name) !== null)
            e.context.set('align-x', name);
    };

    this.init = function(o){
        o.eventManager.addListener('widget.tools.input', inputHandler);
        o.eventManager.addListener('widget.editor.overflow', limitReached);
        o.eventManager.addListener('widget.tools.text-style', textStyle);
        o.eventManager.addListener('widget.tools.align-y', alignY);
        o.eventManager.addListener('widget.tools.align-x', alignX);
        o.eventManager.addListener('widget.tools.input.focus', iFocus);
        return o;
    };
    this.getType = function(){return 'text';};
};