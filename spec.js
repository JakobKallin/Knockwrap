describe('Knockwrap', function() {
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
});