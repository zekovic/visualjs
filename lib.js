

//console.log('test', $('#new_button'));



$(window).on('load', function (e) {
	
	var ME = this;
	var selected_new_cmp = $('#components > .selected').attr('id');
	var panel_mouse_down = false;
	var panel_mouse_up = false;
	
	var area = $('#main_center');
	
	var new_tmp_item = $('#new_tmp_item');
	var coord_start = area.position();
	var x_start = parseInt(coord_start.left);
	var y_start = parseInt(coord_start.top);
	
	$('#main_left #components > div').unbind('click').bind('click', function(e, x, y, z) {
	//$('#new_button').bind('click', function(e, x, y, z) {
		var me = $(this);
		var tool = me.attr('id');
		selected_new_cmp = tool;
		//console.log(this.id, me);
		//console.log(e,x,y,z);
		
		$('#main_left #components > div').removeClass('selected');
		me.addClass('selected');
		var tool_cursor = 'default';
		if (tool != 'cmp_select') { var tool_cursor = 'crosshair'; }
		$('#main_center').css('cursor', tool_cursor);
		
		/*if (tool == '') { var tool_cursor = ''; }
		if (tool == '') { var tool_cursor = ''; }
		if (tool == '') { var tool_cursor = ''; }
		if (tool == '') { var tool_cursor = ''; }
		if (tool == '') { var tool_cursor = ''; }*/
	});
	
	$('#main_center').unbind('mousemove').bind('mousemove', function(e){
		
		//console.log(e.clientX, e.clientY);
		//window.test=e;
		
		//console.log(e.target.id);
		/*if (e.target.id != 'main_center') {
			return;
		}*/
		/*if (e.target.id != 'main_center' && e.target.id != 'new_tmp_item') {
			return;
		}*/
		if (!$(e.target).hasClass('container') && e.target.id != 'new_tmp_item') {
			return;
		}
		
		if (e.which == 0) {
			//if (!$('#mouse_x_drag').text() || parseInt($('#mouse_x_drag').text()) <= 0) {
				
				$('#mouse_x').text(e.offsetX);
				$('#mouse_y').text(e.offsetY);
				$('#mouse_x_drag').text('');
				$('#mouse_y_drag').text('');
			//} else {
			//	console.log('SHAPE: ');
			//}
			
		}
		if (e.which == 1) {
			
			
			if (selected_new_cmp == 'cmp_select') {
				return;
			}
			
			var xpos = parseInt($('#mouse_x').text());
			var ypos = parseInt($('#mouse_y').text());
			
			xpos = snapToGrid(xpos);
			ypos = snapToGrid(ypos);
			
			/*var width = e.clientX - x_start - xpos;
			var height = e.clientY - y_start - ypos;*/
			var width = e.offsetX - xpos;
			var height = e.offsetY - ypos;
			
			width = snapToGrid(width);
			height = snapToGrid(height);
			
			var tmp;
			if (width < 0) { width = Math.abs(width); xpos-= width; /*$('#mouse_x').text(xpos);*/}
			if (height < 0) { height = Math.abs(height); ypos-= height; /*$('#mouse_y').text(ypos);*/}
			
			$('#mouse_x_drag').text(width);
			$('#mouse_y_drag').text(height);
			
			var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
			//console.log(xpos,ypos,width,height);
			if (width > 0 && height > 0) {
				new_tmp_item[0].className = 'component '+cmp_type;
				new_tmp_item.css({'left': xpos, 'top':ypos, 'width':width, 'height':height});
			}
		}
		
	});
	
	$('#main_center').unbind('mouseup').bind('mouseup', function(e){
		//new_tmp_item.css({});
		
		//e.preventDefault();
		if (e.target.id != 'main_center' && e.target.id != 'new_tmp_item') {
			return;
		}
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
	
	var cmp_left = snapToGrid($('#main_center > #new_tmp_item').css('left'));
	var cmp_top = snapToGrid($('#main_center > #new_tmp_item').css('top'));
	var cmp_width = snapToGrid($('#main_center > #new_tmp_item').css('width'));
	var cmp_height = snapToGrid($('#main_center > #new_tmp_item').css('height'));
	
	$('#main_center > #new_tmp_item').css({'left': -5000, 'top':-5000, 'width':0, 'height':0});
	//$('#main_center > #new_tmp_item').resizable('destroy');
	
	if (cmp_width < 20 && cmp_height < 20) {
		return;
	}
	
	cmp_css = {
		'left': cmp_left,
		'top': cmp_top,
		'width': cmp_width,
		'height': cmp_height,
		
		'cursor': 'move'
	};
	cmp_html = '<div class=component id=_id_>_type_</div>';
	
	if (cmp_type == 'button') {
		cmp_html = '<div class="component button" id=_id_>Button</div>';
	}
	if (cmp_type == 'textbox') {
		//cmp_html = '<input class="component textbox" id=_id_ type=text />';
		cmp_html = '<div class="component textbox" id=_id_></div>';
	}
	if (cmp_type == 'label') {
		cmp_html = '<div class="component label" id=_id_>_type_</div>';
	}
	
	if (cmp_type == 'panel') {
		cmp_html = '<div class="component container panel" id=_id_>_type_</div>';
	}
	if (cmp_type == 'form') {
		cmp_html = '<div class="component container form" id=_id_>_type_</div>';
	}
	
	cmp_html = cmp_html.replace('_id_', cmp_id).replace('_type_', cmp_type);
	//console.log(cmp_id);
	//var cmp_css = "left: "+$('#mouse_x').text()+"px; top: "+$('#mouse_y').text()+"px; width: "+$('#mouse_x_drag').text()+"px; height: "+$('#mouse_y_drag').text()+"px; ";
	//var cmp_html = "<div class=component id="+cmp_id+" style='"+cmp_css+"'>"+cmp_type+"</div>";
	
	
	
	$('#main_center').append(cmp_html);
	var cmp_el = $('#'+cmp_id);
	cmp_el.draggable({snap: '#main_center', grid: [ 10, 10 ]});
	cmp_el.resizable({snap: '#main_center', grid: [ 10, 10 ]});
	//cmp_el.css({'cursor':'move'});
	cmp_el.css(cmp_css);
	
	cmp_el.bind('click', function(){
		if ($('.clicked').attr('id') == $(this).attr('id')) {
			console.log('already selected...');
			return;
		}
		$('.clicked').removeClass('clicked').resizable('destroy');
		$(this).addClass('clicked');
		$(this).resizable({snap: '#main_center', grid: [ 10, 10 ]});
		fillPropertiesTable();
	});
	cmp_el.trigger('click');
	//setTimeout( function(){ cmp_el.trigger('click');}, 1500);
	
	//console.log(cmp_type, cmp_id, cmp_html);
	//console.log($('#mouse_x').text(), $('#mouse_y').text(), $('#mouse_x_drag').text(), $('#mouse_y_drag').text());
	
}

function snapToGrid(value) {
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