Object.getPropertyDescriptor = function(target, property) {
	var descriptor = Object.getOwnPropertyDescriptor(target, property);
	var proto = Object.getPrototypeOf(target);
	
	if ( descriptor ) {
		return descriptor;
	} else if ( proto ) {
		return Object.getPropertyDescriptor(proto, property);
	} else {
		return undefined;
	}
};

knockwrap = function() {
	function wrapObject(target) {
		for ( var property in target ) {
			wrapProperty(target, property);
		}
	}
	
	function wrapProperty(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		if ( descriptor.get ) {
			wrapGetter(target, property);
		} else if ( target[property] instanceof Array ) {
			wrapArrayProperty(target, property);
		} else {
			wrapSimpleProperty(target, property);
		}
	}
	
	function wrapSimpleProperty(target, property) {
		var observable = ko.observable(target[property]);
		var getter = function() {
			return observable();
		};
		var setter = function(value) {
			observable(value);
		};
		Object.defineProperty(target, property, {
			get: getter,
			set: setter
		});
		
		return observable;
	}
	
	function wrapGetter(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		var originalGetter = descriptor.get;
		var observable = ko.computed(originalGetter, target);
		var wrappedGetter = function() {
			return observable();
		};
		
		Object.defineProperty(target, property, {
			get: wrappedGetter
		});
	}
	
	function wrapArrayProperty(target, property) {
		var array = target[property];
		var observable = ko.observableArray(array);
		
		var wrapper = {};
		array.forEach(function(value, index) {
			wrapObject(value);
			Object.defineProperty(wrapper, index, {
				get: function() { return observable()[index]; }
			});
		});
		
		target[property] = wrapper;
	}
	
	return {
		wrapProperty: wrapProperty,
		wrapObject: wrapObject
	};
}();