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
		var latestValue;
		var viewModel = {
			first: 'James',
			last: 'Smith',
			get full() {
				return latestValue = this.first + ' ' + this.last;
			}
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.first = 'Robert';
		expect(latestValue).toBe('Robert Smith');
	});
	
	it('mutates objects in arrays', function() {
		var latestValue;
		var viewModel = {
			array: [ { name: 'James' } ],
			get firstTitle() {
				return latestValue = 'Mr. ' + this.array[0].name;
			}
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.array[0].name = 'Robert';
		expect(latestValue).toBe('Mr. Robert');
	});
});