

//console.log('test', $('#new_button'));



$(window).on('load', function (e) {
	
	var selected_new_cmp = $('#components > .selected').attr('id');
	var panel_mouse_down = false;
	var panel_mouse_up = false;
	var new_tmp_item = $('#main_center > #new_tmp_item');
	var coord_start = $('#main_center').position();
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
		if (e.target.id != 'main_center' && e.target.id != 'new_tmp_item') {
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
			//var width = e.offsetX - xpos;
			//var height = e.offsetY - ypos;
			var width = e.clientX - x_start - xpos;
			var height = e.clientY - y_start - ypos;
			
			$('#mouse_x_drag').text(width);
			$('#mouse_y_drag').text(height);
			
			//console.log(xpos,ypos,width,height);
			if (width > 0 && height > 0) {
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
});


function newComponent() {
	var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
	//var cmp_type = selected_new_cmp.replace('new_', '');
	var cmp_id = cmp_type + '_' + Date.now()+''+parseInt(Math.random()*1000);
	
	cmp_css = {
		'left': $('#mouse_x').text(),
		'top': $('#mouse_y').text(),
		'width':$('#mouse_x_drag').text(),
		'height': $('#mouse_y_drag').text(),
		
		'cursor': 'move'
	};
	cmp_html = '<div class=component id=_id_>_type_</div>';
	
	if (cmp_type == 'button') {
		cmp_html = '<div class="component button" id=_id_>Button</div>';
	}
	if (cmp_type == 'textbox') {
		cmp_html = '<input class="component textbox" id=_id_ type=text />';
	}
	
	cmp_html = cmp_html.replace('_id_', cmp_id).replace('_type_', cmp_type);
	//console.log(cmp_id);
	//var cmp_css = "left: "+$('#mouse_x').text()+"px; top: "+$('#mouse_y').text()+"px; width: "+$('#mouse_x_drag').text()+"px; height: "+$('#mouse_y_drag').text()+"px; ";
	//var cmp_html = "<div class=component id="+cmp_id+" style='"+cmp_css+"'>"+cmp_type+"</div>";
	
	$('#main_center > #new_tmp_item').css({'left': -10, 'top':-10, 'width':0, 'height':0});
	
	$('#main_center').append(cmp_html);
	var cmp_el = $('#'+cmp_id);
	cmp_el.draggable();
	cmp_el.resizable();
	//cmp_el.css({'cursor':'move'});
	cmp_el.css(cmp_css);
	
	//console.log(cmp_type, cmp_id, cmp_html);
	//console.log($('#mouse_x').text(), $('#mouse_y').text(), $('#mouse_x_drag').text(), $('#mouse_y_drag').text());
	
}