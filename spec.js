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
	
	it('exposes objects added to arrays', function() {
		var latestValue;
		var viewModel = {
			array: []
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.array.push({ name: 'James' })
		expect(viewModel.array[0].name).toBe('James');
	});
	
	// This is to make sure that array indexes are wrapped only when they are outside the array's old range.
	it('exposes multiple objects added to arrays', function() {
		var latestValue;
		var viewModel = {
			array: []
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.array.push({ name: 'James' })
		viewModel.array.push({ name: 'Robert' })
		expect(viewModel.array[1].name).toBe('Robert');
	});
	
	it('exposes length property of array', function() {
		var viewModel = {
			array: []
		};
		knockwrap.wrapObject(viewModel);
		
		expect(viewModel.array.length).toBe(0);
	});
	
	it('updates length property of array', function() {
		var latestValue;
		var viewModel = {
			array: [],
			get count() {
				return latestValue = this.array.length;
			}
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.array.push({ name: 'James' });
		expect(viewModel.array.length).toBe(1);
	});
	
	it('removes objects removed by the splice method', function() {
		var viewModel = {
			array: [{ name: 'James' }]
		};
		knockwrap.wrapObject(viewModel);
		
		viewModel.array.splice(0);
		expect(viewModel.array.length).toBe(0);
	});
	
	it('notifies changes to objects added by the splice method', function() {
		var viewModel = {
			array: []
		};
		knockwrap.wrapObject(viewModel);
		
		var latestValue;
		viewModel.array.splice(0, 0, {
			name: 'James',
			get title() {
				return latestValue = 'Mr. ' + this.name;
			}
		});
		viewModel.array[0].name = 'Robert';
		expect(latestValue).toBe('Mr. Robert');
	});
});