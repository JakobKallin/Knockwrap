describe('Knockout', function() {
	it('processes nodes not added to document', function() {
		var viewModel = {
			name: 'John'
		};
		var node = document.createElement('div');
		node.dataset.bind = 'text: name';
		ko.applyBindings(viewModel, node);
		expect(node.textContent).toBe('John');
	});
	
	/*
	it('supports change notification for nodes not added to document', function() {
		var viewModel = {
			name: ko.observable('John')
		};
		
		var node = document.createElement('div');
		node.dataset.bind = 'text: name';
		ko.applyBindings(viewModel, node);
		
		expect(node.textContent).toBe('John');
		viewModel.name('James');
		expect(node.textContent).toBe('James');
	});
	*/
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
		
		var node = document.createElement('div');
		node.dataset.bind = 'text: name';
		container.appendChild(node);
		ko.applyBindings(viewModel, node);
		
		expect(node.textContent).toBe('John');
	});
	
	it('handles simple value binding with change event', function() {
		var viewModel = {
			name: 'John'
		};
		knockwrap.wrap(viewModel);
		
		var node = document.createElement('div');
		node.dataset.bind = 'text: name';
		container.appendChild(node);
		ko.applyBindings(viewModel, node);
		
		expect(node.textContent).toBe('John');
		viewModel.name = 'James';
		expect(node.textContent).toBe('James');
	});
});