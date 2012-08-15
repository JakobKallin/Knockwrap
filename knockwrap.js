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
		if ( target instanceof Object ) {
			for ( var property in target ) {
				wrapProperty(target, property);
			}
		}
	}
	
	function wrapProperty(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		if ( descriptor.get ) {
			wrapGetter(target, property);
		} else if ( target[property] instanceof Array ) {
			wrapArrayProperty(target, property);
		} else if ( target[property] instanceof Object ) {
			wrapObject(target[property]);
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
			set: setter,
			enumerable: true
		});
	}
	
	function wrapGetter(target, property) {
		var descriptor = Object.getPropertyDescriptor(target, property);
		var originalGetter = descriptor.get;
		var observable = ko.computed(originalGetter, target);
		var wrappedGetter = function() {
			return observable();
		};
		
		Object.defineProperty(target, property, {
			get: wrappedGetter,
			enumerable: true
		});
	}
	
	function wrapArrayProperty(target, property) {
		var array = target[property];
		var observable = ko.observableArray(array);
		
		var wrapper = Object.create(array);
		array.forEach(function(value, index) {
			wrapObject(value);
			wrapArrayIndex(wrapper, index, observable);
		});
		
		wrapLength(wrapper, observable);
		wrapMutators(wrapper, observable);
		
		target[property] = wrapper;
	}
	
	function wrapArrayIndex(wrapper, index, observable) {
		Object.defineProperty(wrapper, index, {
			get: function() { return observable()[index]; },
			enumerable: true
		});
	}
	
	function wrapLength(wrapper, observable) {
		var getter = function() {
			return observable().length;
		};
		Object.defineProperty(wrapper, 'length', {
			get: getter,
			enumerable: true
		});
	}
	
	// We need all of these in a single method so that they all have access to the same maxLength variable.
	function wrapMutators(wrapper, observable) {
		var maxLength = observable().length;
		
		wrapper.push = function() {
			var args = Array.prototype.slice.call(arguments);
			args.map(wrapObject);
			observable.push.apply(observable, args);
			maxLength = wrapNewArrayIndexes(wrapper, observable, maxLength);
		};
		
		wrapper.splice = function() {
			var args = Array.prototype.slice.call(arguments);
			var newObjects = args.slice(2);
			newObjects.map(wrapObject);
			observable.splice.apply(observable, args);
			maxLength = wrapNewArrayIndexes(wrapper, observable, maxLength);
		};
	}
	
	function wrapNewArrayIndexes(wrapper, observable, maxLength) {
		var oldLastIndex = maxLength - 1;
		var newLength = observable().length;
		var newLastIndex = newLength - 1;
		for ( var index = oldLastIndex + 1; index <= newLastIndex; index += 1 ) {
			wrapArrayIndex(wrapper, index, observable);
		}
		
		var newMaxLength = Math.max(maxLength, newLength);
		return newMaxLength;
	}
	
	function deepCopy(original) {
		if ( original instanceof Object ) {
			return deepCopyObject(original);
		} else {
			return original;
		}
	}
	
	function deepCopyObject(original) {
		var copy = {};
		for ( var property in original ) {
			var descriptor = Object.getPropertyDescriptor(original, property);
			// We need to check for .get because the property might be an array or object, and those are not wrapped.
			var propertyIsArray = (
				!descriptor.get &&
				!descriptor.set &&
				original[property] instanceof Array
			);
			var propertyIsObject = (
				!descriptor.get &&
				!descriptor.set &&
				original[property] instanceof Object &&
				!propertyIsArray
			);
			var propertyIsGetter = descriptor.get && !descriptor.set;
			
			if ( propertyIsObject ) {
				copy[property] = deepCopyObject(original[property]);
			} else if ( propertyIsArray ) {
				copy[property] = [];
				original[property].map(function(originalValue) {
					var copyValue = knockwrap.copy(originalValue);
					copy[property].push(copyValue);
				});
			} else if ( propertyIsGetter ) {
				var proto = Object.getPrototypeOf(original);
				// We need to get the prototype's descriptor because the instance's getter is wrapped and bound with that instance as "this".
				var protoDescriptor = Object.getPropertyDescriptor(proto, property);
				Object.defineProperty(copy, property, {
					get: protoDescriptor.get,
					configurable: true,
					enumerable: true
				});
			} else {
				copy[property] = knockwrap.copy(original[property]);
			}
		};
		
		knockwrap.wrapObject(copy);
		return copy;
	}
	
	return {
		wrapProperty: wrapProperty,
		wrapObject: wrapObject,
		copy: deepCopy
	};
}();