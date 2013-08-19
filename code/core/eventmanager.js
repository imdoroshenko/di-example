var EventManager = SERVICES['constructor']['event-manager'] = function(){
    var my = this,
        context = null,
        eventCollections = {},
        stopTriggering = false;

    this.addListener = function(eventName, listener, priority){
        if(!eventCollections[eventName])
            eventCollections[eventName] = [];
        if(eventCollections[eventName].indexOf(listener) === -1){
            priority = typeof(priority) == 'undefined'? eventCollections[eventName].length : priority;
            eventCollections[eventName].splice(priority, 0, listener);
        }
        return this;
    };

    this.getListenerPriority = function(eventName, listener){
        return eventCollections[eventName].indexOf(listener);
    };

    this.removeListener = function(eventName, listener){
        var indx = eventCollections[eventName].indexOf(listener);
        if(indx !== -1)
            eventCollections[eventName].splice(indx, 1);
        return this;
    };

    this.triggerEvent = function(eventName, params){
        if(!eventCollections[eventName])
            return this;
        eventCollections[eventName].concat([]).some(function(listener){
            var eventObject = {
                'eventManager' : my,
                'event' : eventName,
                'context' : my.getContext(),
                'params' : params || null
            };
            if(listener instanceof Array)
                listener[1].call(listener[0], eventObject);
            else
                listener(eventObject);
            return stopTriggering;
        });
        stopTriggering = false;
        return this;
    };

    this.__init__ = function(){
        return this;
    };

    this.setContext = function(obj){
        context = obj;
        return this;
    };
    this.stopTriggering = function(){stopTriggering = true; return this;};

    this.getContext = function(){return context;};
};