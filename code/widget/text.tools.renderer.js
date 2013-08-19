SERVICES['constructor']['text-tools-renderer'] = function(){
	var my = this;
    this.init = function(o){
		if(o.view === null){
            o.view = my.$getRichView()().setEventManager(o.eventManager);
			o.eventManager.getContext().addSubscriber(function(){
				applyValues(o.view, o.eventManager.getContext());
			});
		}
		applyValues(o.view, o.eventManager.getContext());
		return o;
	};
    this.getType = function(){return 'text';};
	var applyValues = function(view, model){
        view.node.title.el.textContent = model.get('title')||'Text widget';

		cm[!!model.get('bold')? 'addClass' : 'removeClass'](view.node.bold.el, 'button-pressed');
		cm[!!model.get('italic')? 'addClass' : 'removeClass'](view.node.italic.el, 'button-pressed');
		cm[!!model.get('underline')? 'addClass' : 'removeClass'](view.node.underline.el, 'button-pressed');

        cm[!!model.get('bold')? 'addClass' : 'removeClass'](view.node.textInput.el, 'bold');
        cm[!!model.get('italic')? 'addClass' : 'removeClass'](view.node.textInput.el, 'italic');
        cm[!!model.get('underline')? 'addClass' : 'removeClass'](view.node.textInput.el, 'underline');

        cm[model.get('align-y') === 't'? 'addClass' : 'removeClass'](view.node.top.el, 'button-pressed');
        cm[model.get('align-y') === 'm'? 'addClass' : 'removeClass'](view.node.middle.el, 'button-pressed');
        cm[model.get('align-y') === 'b'? 'addClass' : 'removeClass'](view.node.bottom.el, 'button-pressed');

        cm[model.get('align-x') === 'l'? 'addClass' : 'removeClass'](view.node.left.el, 'button-pressed');
        cm[model.get('align-x') === 'c'? 'addClass' : 'removeClass'](view.node.center.el, 'button-pressed');
        cm[model.get('align-x') === 'r'? 'addClass' : 'removeClass'](view.node.right.el, 'button-pressed');

		if(!!model.get('value') && view.node.textInput.el.value !== model.get('value'))
            view.node.textInput.el.value = model.get('value');
		return this;
	};
};