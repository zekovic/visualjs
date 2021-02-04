
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


var common_properties = [
	'id', 'name', 'class', 'text'
];

var css_properties = [
	'left', 'top', 'width', 'height', 'right', 'bottom',
	'color', 'background', 'font', 'font-size', 'font-family', 'text-align',
	'position', 'display', 'align', 'margin', 'padding', 'cursor',
	'overflow', 'overflow-x', 'overflow-y', 'resize'
];


function getProperties(element) {
	var el = $(element);
	var cmp_type = $(element).attr('cmp_type');
	var i;
	var properties_list = [].concat(common_properties);
	properties_list = properties_list.concat(css_properties);
	
	var prop_values = {};
	
	for (i in css_properties) {
		prop_values[css_properties[i]] = el.css(css_properties[i]);
	}
	for (i in common_properties) {
		var pname = common_properties[i];
		if (pname == 'text') {
			if (cmp_type == 'image') { prop_values[pname] = el.text(); }
			else if (cmp_type == 'label') { prop_values[pname] = el.text(); }
			else if (cmp_type == 'textbox') { prop_values[pname] = el.text(); }
			else if (cmp_type == 'textarea') { prop_values[pname] = el.text(); }
			else if (cmp_type == 'form') { prop_values[pname] = '';/* nothing */ }
			else if (cmp_type == 'button') { prop_values[pname] = el.find('> span').text(); }
			else if (cmp_type == 'checkbox') {  prop_values[pname] = el.find('> label').text(); }
			else if (cmp_type == 'radio') { prop_values[pname] = el.find('> label').text(); }
			else if (cmp_type == 'combo') { prop_values[pname] = '';/* nothing */ }
			else if (cmp_type == 'list') {prop_values[pname] = '';}
			else if (cmp_type == 'panel') {prop_values[pname] = '';}
			else if (cmp_type == 'table') {prop_values[pname] = '';}
			else { prop_values[pname] = ''; }
		}
		else { prop_values[pname] = el.attr(pname); }
	}
	
	if (cmp_type == 'textbox') {
		prop_values['inputType'] = 'text';
		prop_values['minLength'] = 0;
		prop_values['maxLength'] = '';
		prop_values['regex'] = '';
		prop_values['regexMessage'] = 'Text is not in correct format';
	}
	
	if (cmp_type == 'form') {
		prop_values['title'] = el.find('> .titlebar').text();
		prop_values['modal'] = '';
		prop_values['resizable'] = '';
		prop_values['openOnLoad'] = '';
		prop_values['closeBtn'] = '';
		prop_values['minimizeBtn'] = '';
		prop_values['maximizeBtn'] = '';
	}
	
	return prop_values;
}


function setProperty(element, prop, val) {
	var cmp_type = $(element).attr('cmp_type');
	var el = $(element);
	
	if (css_properties.indexOf(prop) != -1) {
		prop_camel = prop.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
		//console.log(prop, prop_camel, val);
		el.css(prop_camel, val);
		return true;
	}
	
	if (prop == 'id') { if (!val || $('#'+val).length) {return false;} el.attr('id', val); }
	if (prop == 'name') { el.attr('name', val); }
	if (prop == 'class') { el.attr('class', val) }
	if (prop == 'text') {
		
		if (cmp_type == 'image') { el.text(val); }
		else if (cmp_type == 'label') { el.text(val); }
		else if (cmp_type == 'textbox') { el.val(val); el.text(val); } // .design
		else if (cmp_type == 'textarea') { el.val(val); el.text(val); } // .design
		else if (cmp_type == 'form') { /* nothing */ }
		else if (cmp_type == 'button') { el.find('> span').text(val); }
		else if (cmp_type == 'checkbox') {  el.find('> label').text(val); }
		else if (cmp_type == 'radio') { el.find('> label').text(val); }
		else if (cmp_type == 'combo') { /* nothing */ }
		else if (cmp_type == 'list') {}
		else if (cmp_type == 'panel') {}
		else if (cmp_type == 'table') {}
		else { el.text(val); }
		
	}
	if (prop == 'title') { el.find('> .titlebar').text(val); }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	if (prop == '') {  }
	
	return true;
}