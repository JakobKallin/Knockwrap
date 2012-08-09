describe('Knockwrap', function() {
	var container;

	beforeEach(function() {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(function() {
		document.body.removeChild(container);
	});
	
	it('mutates simple properties', function() {
		var target = {
			name: 'James'
		};
		knockwrap.wrapProperty(target, 'name');
		target.name = 'John';
		expect(target.name).toBe('John');
	});
	
	it('mutates computed properties', function() {
		var target = {
			first: 'James',
			last: 'Smith',
			get full() {
				return this.first + ' ' + this.last;
			}
		};
		knockwrap.wrapProperty(target, 'first');
		knockwrap.wrapProperty(target, 'last');
		knockwrap.wrapProperty(target, 'full');
		
		target.first = 'Robert';
		expect(target.full).toBe('Robert Smith');
	});
	
	it('mutates objects in arrays', function() {
		var viewModel = {
			array: [ { name: 'James' } ]
		};
		knockwrap.wrapProperty(viewModel, 'array');
		
		// We use HTML binding instead of a subscribe() call because the wrapped objects don't expose that method.
		container.innerHTML = '<span data-bind="text: array[0].name"></span>';
		ko.applyBindings(viewModel, container);
		
		viewModel.array[0].name = 'Robert';
		expect(container.textContent).toBe('Robert');
	});
});