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
});
