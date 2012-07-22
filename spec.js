describe('Knockout', function() {
	var container;
	
	beforeEach(function() {
		container = document.createElement('div');
		document.body.appendChild(container);
	});
	
	afterEach(function() {
		document.body.removeChild(container);
	});
	
	it('processes nodes not added to document', function() {
		var viewModel = {
			name: 'John'
		};
		var node = document.createElement('div');
		node.dataset.bind = 'text: name';
		ko.applyBindings(viewModel, node);
		expect(node.textContent).toBe('John');
	});
	
	it('only supports change notification for nodes added to document', function() {
		var viewModel = {
			name: ko.observable('John')
		};
		
		var hiddenNode = document.createElement('div');
		hiddenNode.dataset.bind = 'text: name';
		ko.applyBindings(viewModel, hiddenNode);
		
		expect(hiddenNode.textContent).toBe('John');
		viewModel.name('James');
		expect(hiddenNode.textContent).toBe('John');
		
		var visibleNode = document.createElement('div');
		visibleNode.dataset.bind = 'text: name';
		container.appendChild(visibleNode);
		ko.applyBindings(viewModel, visibleNode);
		
		expect(visibleNode.textContent).toBe('James');
		viewModel.name('John');
		expect(visibleNode.textContent).toBe('John');
	});
});

describe('Knockwrap', function() {
	var container;
	
	beforeEach(function() {
		container = document.createElement('div');
		document.body.appendChild(container);
	});
	
	afterEach(function() {
		document.body.removeChild(container);
	});
	
	it('handles simple value binding', function() {
		var viewModel = {
			name: 'John'
		};
		knockwrap.wrap(viewModel);
		
		container.innerHTML = '<div data-bind="text: name"></div>';
		ko.applyBindings(viewModel, container);
		
		expect(container.textContent).toBe('John');
	});
	
	it('handles simple value binding with change event', function() {
		var viewModel = {
			name: 'John'
		};
		knockwrap.wrap(viewModel);
		
		container.innerHTML = '<div data-bind="text: name"></div>';
		ko.applyBindings(viewModel, container);
		
		expect(container.textContent).toBe('John');
		viewModel.name = 'James';
		expect(container.textContent).toBe('James');
	});
	
	it('handles array binding with simple values', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		container.innerHTML = (
			'<ul data-bind="foreach: names">' +
				// This binds to the strings themselves, not properties of them.
				'<li data-bind="text: $data"></li>' +
			'</ul>'
		);
		ko.applyBindings(viewModel, container);
		
		var itemNodes = container.getElementsByTagName('li');
		expect(itemNodes[0].textContent).toBe('John');
		expect(itemNodes[1].textContent).toBe('James');
		expect(itemNodes[2].textContent).toBe('Robert');
	});
	
	it('handles array binding with simple values and change notification', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		container.innerHTML = (
			'<ul data-bind="foreach: names">' +
				// This binds to the strings themselves, not properties of them.
				'<li data-bind="text: $data"></li>' +
			'</ul>'
		);
		ko.applyBindings(viewModel, container);
		
		viewModel.names[1] = 'Jim';
		
		var itemNodes = container.getElementsByTagName('li');
		expect(itemNodes[0].textContent).toBe('John');
		expect(itemNodes[1].textContent).toBe('Jim');
		expect(itemNodes[2].textContent).toBe('Robert');
	});
	
	it('handles array binding with simple values and array manipulation', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		container.innerHTML = (
			'<ul data-bind="foreach: names">' +
				// This binds to the strings themselves, not properties of them.
				'<li data-bind="text: $data"></li>' +
			'</ul>'
		);
		ko.applyBindings(viewModel, container);
		
		viewModel.names.splice(1, 1); // Remove middle item.
		
		var itemNodes = container.getElementsByTagName('li');
		expect(itemNodes[0].textContent).toBe('John');
		expect(itemNodes[1].textContent).toBe('Robert');
		expect(itemNodes.length).toBe(2);
	});
});