SERVICES['constructor']['widget-model'] = function(){
    AbstractModel.apply(this);

    this.__init__ = function(){
		return this;
	};
};