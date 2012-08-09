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
	function wrapProperty(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		if ( descriptor.get ) {
			wrapGetter(target, property);
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
	}
	
	function wrapGetter(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		var originalGetter = descriptor.get;
		var computed = ko.computed(originalGetter, target);
		var wrappedGetter = function() {
			return computed();
		};
		
		Object.defineProperty(target, property, {
			get: wrappedGetter
		});
	}
	
	return {
		wrapProperty: wrapProperty
	};
}();