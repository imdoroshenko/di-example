var cm = common = new function(){
	var me = this;
	/******************************** Node classes *******************************/
	var replaceClass = this.replaceClass = function(o, oldOne, newOne){
		if(!o) return null;
		return addClass(removeClass(o, oldOne), newOne);
	};
	var addClass = this.addClass = function(o, str){
		if(!o) return null;
		var add = a2o(typeof(str) === 'object'? str : str.split(/\s+/));
		var current = a2o(o && o.className? o.className.split(/\s+/) : []);
		merge(current, add);
		o.className = o2a(current).join(' ');
		return o;
	};
	var removeClass = this.removeClass = function(o, str){
		if(!o) return null;
		var remove = a2o(typeof(str) === 'object'? str : str.split(/\s+/));
		var current = o && o.className? o.className.split(/\s+/) : [];
		var ready = [];
		for(var i = 0, ln = current.length; i < ln; i++){
            if(!remove[current[i]]){
                ready.push(current[i]);
            }
        }
		o.className = ready.join(' ');
		return o;
	};
	var isClass = this.isClass = function(o, str){
		if(!o) return null;
		var classes = o && o.className? o.className.split(/\s+/) : [];
		for(var i = 0, ln = classes.length; i < ln; i++){
			if(classes[i] === str)
				return true;
		}
		return false;
	};
	/***************************** Arrays & Objects *****************************/
	var o2a = this.o2a = function(o){
		if(typeof(o) !== 'object')
			return [o];
		var a = [];
		for(var i in o){
			if(i)
				a.push(o[i]);
		}
		return a;
	};
	var a2o = this.a2o = function(a){
		var o = {};
		for(var i = 0, ln = a.length; i < ln; i++){
			o[a[i]] = a[i];
		}
		return o;
	};
	var merge = this.merge = function(){
		var stack = arguments[0];
		for(var k = 1, ln = arguments.length; k < ln; k++){
			var object = arguments[k];
			if(typeof(object) != 'object'){continue;}
			for(var i in object){
				if(!object.hasOwnProperty(i))
					continue;
				stack[i] = (typeof(stack[i]) === 'object' && typeof(object[i]) === 'object' && !object[i].nodeType)
                    ? arguments.callee(stack[i], object[i])
                    : object[i];
			}
		}
		return stack;
	};
    var clone = this.clone = function(o, copyNode){
        if(o instanceof Node)
            return o.cloneNode(true);
        else
            var n = o instanceof Array? [] : {};
        for(var i in o){
            if(!o.hasOwnProperty(i))
                continue;
            n[i] = (o[i] !== null && typeof(o[i]) === 'object' && o[i].constructor != RegExp)?
                (o[i].nodeType?
                    (copyNode? o[i].cloneNode : o[i])
                    :
                    arguments.callee(o[i])) : o[i];
        }
        return n;
    };
}