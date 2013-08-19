SERVICES['constructor']['text-editor-renderer'] = function(){
	var my = this;

    this.init = function(o){
		if(o.view === null){
            o.view = my.$getRichView()().setEventManager(o.eventManager);
			o.eventManager.getContext().addSubscriber(function(){
				applyValues(o.view, o.eventManager.getContext(), o.eventManager);
			});
		}
		this.$getGlobalEventManager().addListener('application.start', function(e){applyValues(o.view, o.eventManager.getContext(), o.eventManager);});
		return o;
	};
    this.getType = function(){return 'text';};
    this.xAlignValues = {
        'c' : 'center',
        'r' : 'right',
        'l' : 'left'
    };
    this.yAlignValues = {
        'm' : 'middle',
        'b' : 'bottom',
        't' : 'top'
    };
	var applyValues = function(view, model, eventManager){
		if(model.get('value') !== view.node.valueHolder.el.textContent)
			view.node.valueHolder.el.textContent = model.get('value');
		/*** Domain Object Params ***/
		var DO = model.$getDomainObject();
		for(var param in DO){
			switch(param){
				case 'text-x-compression-default':
                    view.node.valueHolder.el.style.WebkitTransform = 'scale(' + model.get('text-x-compression-default') + ',1)';
				break;
				case 'bold':
                    cm[!!model.get('bold')? 'addClass' : 'removeClass'](view.node.valueHolder.el, 'bold');
				break;
				case 'underline':
                    cm[!!model.get('underline')? 'addClass' : 'removeClass'](view.node.valueHolder.el, 'underline');
				break;
				case 'italic':
                    cm[!!model.get('italic')? 'addClass' : 'removeClass'](view.node.valueHolder.el, 'italic');
				break;
				case 'align-x':
                    view.node.container.el.style.textAlign = my.xAlignValues[model.get('align-x')]||'center';
				break;
                case 'align-y':
                    view.node.valueHolder.el.style.verticalAlign = my.yAlignValues[model.get('align-y')]||'middle';
                break;
				case 'text-height':
                    view.node.valueHolder.el.style.fontSize = model.get('text-height') + (model.get('text-height-dimension')||'px');
				break;
				case 'block-height':
                    view.node.container.el.style.height = model.get('block-height') + (model.get('block-height-dimension')||'px');
				break;
				case 'block-width':
                    view.node.container.el.style.width = model.get('block-width') + (model.get('block-width-dimension')||'px');
				break;
                case 'block-x-position':
                    view.node.container.el.style.left = model.get('block-x-position') + (model.get('block-position-dimension')||'px');
                break;
                case 'block-y-position':
                    view.node.container.el.style.top = model.get('block-y-position') + (model.get('block-position-dimension')||'px');
                break;
			}
		}
		/*** State params ***/
		for(var param in model.state){
			switch(param){
				case 'editable':
                    view.node.container.el.style.border = model.state.editable? '1px dotted grey' : 'none';
                    view.node.valueHolder.el.contentEditable = true;
                    view.node.valueHolder.el.focus();
				break;
			}
		}
		/*** Behavior params ***/
		if(model.get('text-height-calculate-mode')){
            view.node.valueHolder.el.style.fontSize = model.get('text-height-min') + (model.get('text-height-dimension')||'px');
			applyHeight(view.node.valueHolder.el, view.node.container.el, model);
		}
	    var tmp = calculateXCompression(view.node.valueHolder.el, model);
        view.node.valueHolder.el.style.WebkitTransform = 'scale(' + tmp + ', 1)';
        view.node.valueHolder.el.style.marginLeft = ((tmp - 1)*view.node.valueHolder.el.offsetWidth)/2 + 'px';
        view.node.valueHolder.el.style.marginRight = ((tmp - 1)*view.node.valueHolder.el.offsetWidth)/2 + 'px';

		/*** Other stuff ***/
		if(model.state.overflow){
			eventManager.triggerEvent('widget.editor.overflow', {});
		}
		return this;
	};

	var applyHeight = function(textHolder, container, model){
		if(textHolder.offsetWidth && container.offsetWidth > textHolder.offsetWidth){
			var step = model.get('text-height-step'),
			    max = model.get('text-height-max'),
			    currentValue = parseInt(textHolder.style.fontSize)||model.get('text-height'),
                currentHeight = container.offsetHeight;
			while(true){
				textHolder.style.fontSize = (currentValue + step) + (model.get('text-height-dimension')||'px');
				if(max <= (currentValue + step) || container.offsetWidth <= textHolder.offsetWidth || container.offsetHeight <= textHolder.offsetHeight){
					textHolder.style.fontSize = currentHeight;
					break;
				}
                currentValue += step;
			}
		}
		return currentHeight;
	};
	var calculateXCompression = function(textHolder, model){
		var min = 0,
            step = 0,
		    currentCompression = getCurrentXCompression(textHolder),
		    currentWidth = parseFloat(textHolder.offsetWidth),
		    maxWidth = parseFloat(model.get('block-width'));

		model.state.limit = false;
        if(!model.get('text-x-compression-mode')){
            model.state.overflow = !(currentWidth*currentCompression <= maxWidth);
            model.state.limit = (currentWidth*currentCompression >= maxWidth);
            return currentCompression;
        }
		if(currentWidth > maxWidth){
            min = parseFloat(model.get('text-x-compression-min'));
            step = parseFloat(model.get('text-x-compression-step'));
			if(!(min && step))
				throw 'TextEditorRenderer->calculateXCompression: wrong params';
			while(true){
				if(currentWidth*currentCompression <= maxWidth){
					model.state.overflow = false;
					break;
				}else if(currentCompression - step  <= min){
					model.state.overflow = !(currentWidth*currentCompression <= maxWidth);
					model.state.limit = true;
					break;
				}
				currentCompression -= step;
				if(currentCompression < min)
					currentCompression = min;
			}
		}
		return currentCompression;
	};
	
	var getCurrentXCompression = function(el){
		var res = el.style.WebkitTransform.match(/scale\(([ 0-9\.]+),[ 0-9\.]+\)/i);
		return parseFloat(res? res[1]||1 : 1);
	};
};