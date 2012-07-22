knockwrap = function() {
	function wrapObject(target) {
		for ( var property in target ) {
			wrapProperty(target, property);
		}
	}
	
	function wrapProperty(target, property) {
		if ( target[property] instanceof Array ) {
			wrapArray(target, property);
		} else {
			wrapNonArray(target, property);
		}
	}
	
	var mutatingArrayMethods = ['pop', 'push', 'reverse', 'shift', 'splice', 'sort', 'unshift'];
	
	function wrapArray(target, property) {
		var array = target[property];
		var observable = ko.observableArray(array);
		var wrapper = Object.create(array);
		target[property] = wrapper;
		
		// We do this to set up a dependency. How can it be done in a nicer way?
		Object.defineProperty(wrapper, 'length', {
			get: function() {
				return observable().length;
			}
		});
		
		// Recursively wrap array values so changes are notified when array indexes are reassigned.
		array.forEach(function(value, index) {
			wrapProperty(array, index);
		});
		
		// These methods mutate the array and so need to trigger notifications.
		mutatingArrayMethods.forEach(function(methodName) {
			var originalMethod = array[methodName];
			wrapper[methodName] = function() {
				observable.valueWillMutate();
				var result = originalMethod.apply(array, arguments);
				observable.valueHasMutated();
				
				return result;
			};
		});
	}
	
	function wrapNonArray(target, property) {
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
	
	return {
		wrap: wrapObject
	};
}();