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
});