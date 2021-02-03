
var form_components = {};

var x = {id: 0, class:'conponent', text:'Cmp'};
var y = {text:'Form', modal:true, resizable:false, hidden:true};
form = $.extend({}, x, y);

form_components.component = {
	id: '',
	class: 'component',
	text: 'Element'
	
};

form_components.button = $.extend({}, form_components.component, {
	
});

form_components.form = $.extend({}, form_components.component, {
	text: 'Form',
	modal: true,
	resizable: false,
	hidden: true
	
});

form_components.createNew = function(cmp_type) {
	if (cmp_type === undefined) {
		cmp_type = $('#components > .selected').attr('id').replace('new_', '');
	}
	console.log('New component');
	
	cmp_count = area.find('.component.'+cmp_type).length;
	
	
	if (type == 'form') {
		
	}
	
}