var AbstractModel = function(){
	var my = this,
        observation = true;
    this.state = {};

    this.init = function(){
		return this;
	};

    this.set = function(property, value){
		var domain = this.$getDomainObject();
		if(!('object' == typeof(domain))) throw 'Invalid domain type';
		domain[property] = value;
		if(my.isObservable())
            this.$getEventManager().triggerEvent('widget.model.set', {});
		return my;
	};

    this.get = function(property){
		var domain = this.$getDomainObject();
		if(!('object' == typeof(domain))) throw 'Invalid domain type';
		return domain[property] || null;
	};

    this.addSubscriber = function(obj){
        this.$getEventManager().addListener('widget.model.set', obj);
        return this;
    };

    this.stopObservation = function(){
        observation = false;
        return this;
    };

    this.startObservation = function(){
        observation = true;
        return this;
    };

    this.triggerObserver = function(){
        this.$getEventManager().triggerEvent('widget.model.set');
        this.startObservation();
        return my;
    };

    this.isObservable = function(){
        return observation;
    };
};