var DEPENDENCY = {};
var SERVICES = {
    'constructor' : {},
    'config' : {}
};

var DI = new function(){
    var my = this,
        poll = {},
        constructorMethod = '__init__',
        prefix = '$get',
        dependencyList = null,
        globalScope = window;

    this.get = function(serviceName, additionalDependency){
        var dependency = getDependency();
        if(SERVICES.config[serviceName] && SERVICES.config[serviceName].singleton === true && poll[serviceName]){
            if(additionalDependency){
                console.log(additionalDependency + ' additionalDependency ' + serviceName);
                makeInjections(poll[serviceName], overwriteParams(dependency[serviceName]||{}, additionalDependency));
            }
            return poll[serviceName];
        }
        createServiceInstance(serviceName);
        makeInjections(poll[serviceName], overwriteParams(dependency[serviceName]||{}, additionalDependency||{}));
        if(poll[serviceName][constructorMethod])
            poll[serviceName][constructorMethod]();
        return poll[serviceName];
    };
    var extract = this.extract = function(str, scope){
        try{
            var target = scope||globalScope;
            str.split('.').forEach(function(scope){
                target = target[scope];
            });
            return target;
        }catch(e){
            return undefined;
        }
    };

    var getDependency = function(){
        if(dependencyList != null)
            return dependencyList;
        dependencyList = {};
        for(var listName in DEPENDENCY){
            dependencyList = cm.merge(dependencyList, DEPENDENCY[listName]);
        }
        return dependencyList;
    };

    var createServiceInstance = function(serviceName){
        if(!SERVICES['constructor'][serviceName])
            throw new Error('Service ' + serviceName + ' does not exists');
        return poll[serviceName] = new SERVICES['constructor'][serviceName];
    };

    var overwriteParams = function(origin, custom){
        var result = {};
        for(var param in origin){
            if(!origin.hasOwnProperty(param))
                continue;
            result[param] = origin[param];
        }
        for(var param in custom){
            if(!custom.hasOwnProperty(param))
                continue;
            result[param] = custom[param];
        }
        return result;
    };
    var makeInjections = function(service, dependency){
        for(var property in dependency){
            if(!dependency.hasOwnProperty(property))
                continue;
            if(dependency[property] instanceof Array){
                dependency[property].forEach(function(o){
                    inject(service, property, prepareInjection(o));
                });
            }else{
                inject(service, property, prepareInjection(dependency[property]));
            }
        }
        return my;
    };

    var prepareInjection = function(params){
        for(var type in params){
            if(!params.hasOwnProperty(type))
                continue;
            var value = params[type];
            switch (type){
                case 'value':
                    return value;
                case 'object':
                    return typeof(value) === 'string'? extract(value) : value;
                case 'instance':
                    try{
                        return new (typeof(value) === 'string'? extract(value) : value);
                    }catch(e){return undefined;}
                case 'service':
                    return my.get(value, params['dependency']);
                case 'service-constructor':
                    return function(){ return my.get(value, params['dependency']);};
                case 'poll':
                    return (poll[value] || null);
                default:
                    continue;
            }
        }
        return null;
    };

    var inject = function(service, method, injection){
        if(service.hasOwnProperty(method) && typeof(service[method]) === 'function'){
            service[method](injection);
        }else{
            service[prefix + method.slice(0, 1).toUpperCase() + method.slice(1)] = function(){return injection;};
        }
    };
};