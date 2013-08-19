var TextEditorHandler = function(){
	var my = this;
    this.init = function(o){
		o.eventManager.addListener('widget.editor.start-editing', startEdit);
		o.eventManager.addListener('widget.editor.input', onEdit);
		o.eventManager.addListener('widget.editor.blur', stopEdit);
		return o;
	};
	var startEdit = function(o){
		if(o.context.state.editable)
			return true;
		if (window.getSelection().empty) {  // Chrome
			window.getSelection().empty();
		  } else if (window.getSelection().removeAllRanges) {  // Firefox
			window.getSelection().removeAllRanges();
		  }
		o.context.state.editable = true;
		o.context.triggerObserver();
	};
	var stopEdit = function(o){
		if(!o.context.state.editable)
			return false;
		o.params.valueHolder.contentEditable = false;
		o.context.state.editable = false;
		o.context.triggerObserver();
	};
	var onEdit = function(o){
		if(o.context.state.limit && o.context.get('value').length < o.params.target.textContent.length)
			return o.context.triggerObserver();
		o.context.set('value', o.params.target.textContent);
	};
    this.getType = function(){return 'text';};
};