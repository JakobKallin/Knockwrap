knockwrap = function() {
	function wrapObject(target) {
		for ( var property in target ) {
			wrapProperty(target, property);
		}
	}
	
	function wrapProperty(target, property) {
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