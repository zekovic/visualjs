

var area, new_tmp_item, selected_new_cmp;

$(window).on('load', function (e) {
	
	var ME = this;
	selected_new_cmp = $('#components > .selected').attr('id');
	var panel_mouse_down = false;
	var panel_mouse_up = false;
	
	area = $('#main_center');
	
	new_tmp_item = $('#new_tmp_item');
	
	$('#main_left #components > div').unbind('click').bind('click', function(e, x, y, z) {
		var me = $(this);
		var tool = me.attr('id');
		selected_new_cmp = tool;
		
		$('#main_left #components > div').removeClass('selected');
		me.addClass('selected');
		if (tool == 'cmp_select') {
			$('#main_center').css('cursor', 'default');
			$('#main_center .container').css('cursor', 'default').draggable({snap: '#main_center', grid: [ 10, 10 ]}); /////
		} else {
			$('#main_center').css('cursor', 'crosshair');
			$('#main_center .container').css('cursor', 'crosshair').draggable('destroy'); /////
			
		}
		
		
		
	});
	
	$('#main_center').unbind('mousemove').bind('mousemove', function(e){
		
		//console.log(e.target.id);
		/*if (e.target.id != 'main_center' && e.target.id != 'new_tmp_item') {
			return;
		}*/
		
		var in_new_tmp = e.target.id == 'new_tmp_item';
		
		if (!$(e.target).hasClass('container') && !in_new_tmp) {
			return;
		}
		
		area = $(e.target);
		area.append(new_tmp_item);
		
		//$(e.target).css('z-index', 1000);
		//new_tmp_item.css('z-index', 900);
		
		if (e.which == 0) {
			$('#mouse_x').text(e.offsetX);
			$('#mouse_y').text(e.offsetY);
			$('#mouse_x_drag').text('');
			$('#mouse_y_drag').text('');
		}
		if (e.which == 1) {
			
			var distance = 6;
			
			if (selected_new_cmp == 'cmp_select') {
				return;
			}
			
			var xpos = parseInt($('#mouse_x').text());
			var ypos = parseInt($('#mouse_y').text());
			
			xpos = snapToGrid(xpos);
			ypos = snapToGrid(ypos);
			
			var width = parseInt(e.offsetX - xpos-distance);
			var height = parseInt(e.offsetY - ypos-distance);
			
			width = snapToGrid(width);
			height = snapToGrid(height);
			
			/*if (width < 0) { width = Math.abs(width); xpos-= width-10; }
			if (height < 0) { height = Math.abs(height); ypos-= height-10; }*/
			if (width <= 0) { width = -width; xpos-= width-(distance*2); }
			if (height <= 0) { height = -height; ypos-= height-(distance*2); }
			
			$('#mouse_x_drag').text(width);
			$('#mouse_y_drag').text(height);
			
			var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
			//console.log(xpos,ypos,width,height);
			if (width > 0 && height > 0 && !in_new_tmp) {
				//new_tmp_item.show();
				//new_tmp_item[0].className = 'component '+cmp_type;
				new_tmp_item.css({'left': xpos, 'top':ypos, 'width':width, 'height':height});
			}
		}
		
	});
	
	$('#main_center').unbind('mouseup').bind('mouseup', function(e){
		//new_tmp_item.css({});
		
		//e.preventDefault();
		/*if (e.target.id != 'main_center' && e.target.id != 'new_tmp_item') {
			return;
		}*/
		if (!$(e.target).hasClass('container') && e.target.id != 'new_tmp_item') {
			return;
		}
		
		//console.log('mouseup:', e.target.id);
		
		if (selected_new_cmp == 'cmp_select') {
			return;
		}
		newComponent();
	});
	
	
	$('#properties > table').bind('click', function(e) {
		var clicked_el = e.target;
		if (clicked_el.tagName.toLowerCase() != 'td' || $(clicked_el).parent().index() == 0) {
			return;
		}
		var clicked_row = $(clicked_el).parent().children();
		var prop = clicked_row[0].textContent;
		var val = clicked_row[1].textContent;
		$(clicked_row[1]).html("<input id=property_input type=text />");
		$('#property_input').val(val).css({'width': '100px', 'border':'0px'});
		$('#property_input').focus().select();
		$('#property_input').bind('blur', function() {
			var txt_val = $(this).val();
			$('#property_input').remove();
			$(clicked_row[1]).html(txt_val);
			$('.clicked')[0][prop] = txt_val;
		});
	});
});

function newComponent() {
	var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
	//var cmp_type = selected_new_cmp.replace('new_', '');
	var cmp_id = cmp_type + '_' + Date.now()+''+parseInt(Math.random()*1000);
	
	var cmp_left = snapToGrid($('#new_tmp_item').css('left'));
	var cmp_top = snapToGrid($('#new_tmp_item').css('top'));
	var cmp_width = snapToGrid($('#new_tmp_item').css('width'));
	var cmp_height = snapToGrid($('#new_tmp_item').css('height'));
	
	$('#new_tmp_item').css({'left': -5000, 'top':-5000, 'width':0, 'height':0})/*.hide()*/;
	//$('#main_center > #new_tmp_item').resizable('destroy');
	
	if (cmp_width < 20 && cmp_height < 20) {
		return;
	}
	
	cmp_css = {
		'left': cmp_left,
		'top': cmp_top,
		'width': cmp_width,
		'height': cmp_height,
		
		'cursor': 'default'
	};
	
	cmp_el = $('#templates > .' + cmp_type).clone().css(cmp_css).attr('id', cmp_id).addClass('component');
	//$('#main_center').append(cmp_el);
	area.append(cmp_el);
	updateElementList();
	if (!cmp_el.hasClass('container')) {
		cmp_el.draggable({snap: '#main_center', grid: [ 10, 10 ]});
	} else {
		//cmp_el.append('<div id=xx class="hndl ui-icon ui-icon-arrow-4"></div>');
		//cmp_el.draggable({snap: '#main_center', grid: [ 10, 10 ], handle:'.hndl'});
		cmp_el.css('cursor', 'crosshair');
	}
	cmp_el.resizable({snap: '#main_center', grid: [ 10, 10 ]});
	
	
	cmp_el.bind('click', function(e){
		//console.log(e);
		e.preventDefault();
		var tgt = e.target;
		if ($('.clicked').attr('id') == $(tgt).attr('id')) {
			console.log('already selected...');
			return;
		}
		$('.clicked').removeClass('clicked').resizable('destroy');
		$(tgt).addClass('clicked');
		$(tgt).resizable({snap: '#main_center', grid: [ 10, 10 ]});
		fillPropertiesTable();
	});
	cmp_el.trigger('click');
	
}

function snapToGrid(value) {
	//return value;
	var resolution = 10;
	return parseInt(parseInt(value)/resolution) * resolution;
}

function fillPropertiesTable() {
	var js_el = $('.clicked')[0];
	var js_prop = null, prop_type = "";
	var i;
	var table_html = "<tr id=r1><td id=c1>Name</td><td id=c2>Value</td></tr>";
	table_html+= "<tr><td id=c1>&nbsp</td><td id=c2></td></tr>";
	
	/*for (i in js_el) {
		js_prop = js_el[i];
		if (prop_type == 'number' || prop_type == 'string' || prop_type == 'boolean' || js_prop === null) {
			if (i == 'innerHTML' || i == 'outerHTML') {
				continue;
			}
			table_html+= "<tr><td>" + i + "</td><td>" + js_prop + "</td></tr>";
		}
	}
	$('#properties > table').html(table_html);
	
	var table = $('#properties > table');
	var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
	//this.asc = !this.asc
	this.asc = true;
	if (!this.asc){rows = rows.reverse()}
	for (var i = 0; i < rows.length; i++){table.append(rows[i])}
	*/
	for (i in cmp_properties) {
		js_prop = js_el[cmp_properties[i]];
		prop_type = typeof(js_prop);
		table_html+= "<tr><td>" + cmp_properties[i] + "</td><td>" + js_prop + "</td></tr>";
	}
	$('#properties > table').html(table_html);
}


function updateElementList() {
	var list = $('#element_list');
	list.html('<div>Main page</div>');
	$('#main_center .container.form').each(function(){
		list.append('<div>&nbsp;&nbsp;&nbsp;'+ $(this).attr('id') +'</div>');
	});
}



// TODO
var cmp_properties = [
	'id', 'class', 'text', 'left', 'top', 'width', 'height', 'color', 'background', 'font', 'font-size',
	'position', 'display', 'align', 'margin', 'padding', 'cursor', 'overflow'
];

function comparer(index) {
	return function(a, b) {
		var valA = getCellName(a, index), valB = getCellName(b, index)
		return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
	}
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
function getCellName(row, index){ return $(row).children('td').text() }