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
	
	it('handles array binding with simple values', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		var listNode = document.createElement('ul');
		listNode.dataset.bind = 'foreach: names';
		
		var itemNode = document.createElement('li');
		// This binds to the strings themselves, not properties of them.
		itemNode.dataset.bind = 'text: $data';
		listNode.appendChild(itemNode);
		
		container.appendChild(listNode);
		ko.applyBindings(viewModel, listNode);
		
		var generatedNodes = listNode.getElementsByTagName('li');
		expect(generatedNodes[0].textContent).toBe('John');
		expect(generatedNodes[1].textContent).toBe('James');
		expect(generatedNodes[2].textContent).toBe('Robert');
	});
	
	it('handles array binding with simple values and change notification', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		var listNode = document.createElement('ul');
		listNode.dataset.bind = 'foreach: names';
		
		var itemNode = document.createElement('li');
		// This binds to the strings themselves, not properties of them.
		itemNode.dataset.bind = 'text: $data';
		listNode.appendChild(itemNode);
		
		container.appendChild(listNode);
		ko.applyBindings(viewModel, listNode);
		
		viewModel.names[1] = 'Jim';
		
		var generatedNodes = listNode.getElementsByTagName('li');
		expect(generatedNodes[0].textContent).toBe('John');
		expect(generatedNodes[1].textContent).toBe('Jim');
		expect(generatedNodes[2].textContent).toBe('Robert');
	});
	
	it('handles array binding with simple values and array manipulation', function() {
		var viewModel = {
			names: ['John', 'James', 'Robert']
		};
		knockwrap.wrap(viewModel);
		
		var listNode = document.createElement('ul');
		listNode.dataset.bind = 'foreach: names';
		
		var itemNode = document.createElement('li');
		// This binds to the strings themselves, not properties of them.
		itemNode.dataset.bind = 'text: $data';
		listNode.appendChild(itemNode);
		
		container.appendChild(listNode);
		ko.applyBindings(viewModel, listNode);
		
		viewModel.names.splice(1, 1); // Remove middle item.
		
		var generatedNodes = listNode.getElementsByTagName('li');
		expect(generatedNodes[0].textContent).toBe('John');
		expect(generatedNodes[1].textContent).toBe('Robert');
		expect(generatedNodes.length).toBe(2);
	});
});