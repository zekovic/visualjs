

var area, new_tmp_item, selected_new_cmp;

$(window).on('load', function (e) {
	
	var ME = this;
	selected_new_cmp = $('#components > .selected').attr('id');
	var panel_mouse_down = false;
	var panel_mouse_up = false;
	
	area = $('#root #main_center');
	
	new_tmp_item = $('#new_tmp_item');
	
	$('#main_left #components > div').unbind('click').bind('click', function(e, x, y, z) {
		var me = $(this);
		var tool = me.attr('id');
		selected_new_cmp = tool;
		
		$('#main_left #components > div').removeClass('selected');
		me.addClass('selected');
		if (tool == 'cmp_select') {
			$('#root #main_center').css('cursor', 'default');
			$('#root #main_center .container').css('cursor', 'default').draggable({snap: '#root #main_center', grid: [ 10, 10 ]}); /////
		} else {
			$('#root #main_center').css('cursor', 'crosshair');
			$('#root #main_center .container').css('cursor', 'crosshair').draggable('destroy'); /////
			
		}
		
		
		
	});
	
	initProject();
	
	$(window).unbind('keydown').bind('keydown', function(e){
		
		//console.log('KEY:', e.which, e.target.tagName);
		if (e.target.tagName.toLowerCase() == 'input') {
			
			if (e.which == 13 && $(e.target).attr('id') == 'property_input') {
				$('#property_input').trigger('blur');
			}
			
			return;
		}
		
		//return true;
		if (e.which == 46) {
			deleteElement();
		}
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
	
	
	// TOOLBAR:
	$('#tool_delete').bind('click', function(){
		deleteElement();
	});
	
	$('#tool_dock_left').bind('click', function(){
		$('.clicked').css({left:0, top:0, bottom:0, height:'', right:''});
	});
	$('#tool_dock_right').bind('click', function(){
		$('.clicked').css({left:'', top:0, bottom:0, height:'', right:0});
	});
	$('#tool_dock_top').bind('click', function(){
		$('.clicked').css({left:0, top:0, bottom:'', right:0, width:''});
	});
	$('#tool_dock_bottom').bind('click', function(){
		$('.clicked').css({left:0, top:'', bottom:0, right:0, width:''});
	});
	
	$('#tool_export').bind('click', function(){
		$('#form_export').show();
	});
	$('#export_generate').bind('click', function(){
		
		var copied = $('#root #main_center_wrap').clone();
		copied.find('.component').each(function(){
			var this_el = $(this);
			this_el.removeClass('clicked ui-draggable-handle ui-draggable ui-resizable');
			//this_el.find('.ui-resizable-handle').remove();
			var cmp_type = $(this).attr('cmp_type');
			var cmp_both_same = $('#templates .real.'+cmp_type).hasClass('design');
			if (!this_el.hasClass('container') && !cmp_both_same) {
				var real_el = $('#templates .real.'+cmp_type).clone();
				var i;
				var attrs = this_el[0].getAttributeNames();
				for (i in attrs) {
					//console.log(i, attrs[i],  this_el.attr(attrs[i]));
					$(real_el).attr(attrs[i], this_el.attr(attrs[i]));
					//$(real_el).html(this_el.html());
					if (cmp_type == 'textbox' || cmp_type == 'textarea') {
						$(real_el).val(this_el.val());
					}
				}
				this_el.addClass('removing');
				this_el.parent().append(real_el);
				//console.log(real_el.parent());
			}
		});
		copied.find('.ui-resizable-handle').remove();
		copied.find('.removing').remove();
		copied.find('.component.form').draggable({'handle':'.titlebar'});
		var html_template = $('#template_project').html().replaceAll('template__', '');
		$('#export_code_panel > textarea').text(html_template.replace('___main_code_here___', copied.html()));
		$('#export_code_panel_main > textarea').text(copied.html());
		$('#export_preview_panel').html('');
		$('#export_preview_panel').append(copied);
		//copied.draggable('destroy');
		//$('#export_preview_panel .component').resizable('destroy');
		
		
	});
	$('#export_code').bind('click', function(){
		//$('#export_preview_panel').hide();
		$('.export-tab').hide();
		$('#export_code_panel').show();
	});
	$('#export_code_main').bind('click', function(){
		//$('#export_preview_panel').hide();
		$('.export-tab').hide();
		$('#export_code_panel_main').show();
	});
	$('#export_preview').bind('click', function(){
		//$('#export_code_panel').hide();
		$('.export-tab').hide();
		$('#export_preview_panel').show();
	});
	$('#export_exit').bind('click', function(){
		$('#form_export').hide();
	});
	
	
	
	// drop file to import it
	$('#root #main_center_wrap').bind('drop', function(e){
		e.preventDefault();
		e.stopPropagation();
		
		var dataTransfer = e.originalEvent.dataTransfer;
		//var fd = new FormData();
		
		if (dataTransfer.files && dataTransfer.files.length){
			
			var reader = new FileReader();
			
			$.each(dataTransfer.files, function(i, file) {
				
				reader.onload = function(e) {
					fileData = e.target.result;
					fileName = file.name;
					$('#loading_file').load(e.target.result, function(){
						importProject();
					});
				};
				reader.readAsDataURL(file);
			});
			//fd.append("url","drop")
			//upload(fd)
		}
	});
	$('#root #main_center_wrap').bind('dragenter', function(e) {
		//e.originalEvent.dataTransfer.dropEffect = 'copy'
		e.preventDefault();
		e.stopPropagation();
		return false
	});
	$('#root #main_center_wrap').bind('dragover', function(e) {
		e.originalEvent.dataTransfer.dropEffect = 'copy'
		e.preventDefault();
		e.stopPropagation();
		//console.log(JSON.stringify (e.originalEvent.dataTransfer));
		return false
	});
	
	
	$('#tool_open').bind('click', function() {
		//$('#file_opener').trigger('click');
		//$('#root #main_center').html(localStorage.project_data);
		$('#loading_file').html('<div id=main_center>'+localStorage.project_data+'</div>');
		importProject();
	});
	$('#tool_save').bind('click', function() {
		//$('#file_opener').trigger('click');
		localStorage.project_data = $('#root #main_center').html();
	});
	$('#file_opener').bind('change', function(e){
		console.log(this);
		console.log($(this).val());
	});
	
});


function initProject() {

	$('#root #main_center').unbind('mousemove').bind('mousemove', function(e){
		
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
	
	$('#root #main_center').unbind('mouseup').bind('mouseup', function(e){
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
}

function importProject() {
	
	var project_tmp = $('#loading_file #main_center');
	//console.log('PRJ:', project_tmp.find('.component').length);
	project_tmp.find('.component').each(function(){
		var this_el = $(this);
		
		//console.log(this_el);
		
		var cmp_type = $(this).attr('cmp_type');
		var cmp_both_same = $('#templates .real.'+cmp_type).hasClass('design');
		if (!this_el.hasClass('container') && !cmp_both_same) {
			var real_el = $('#templates .real.'+cmp_type).clone();
			var design_el = $('#templates .design.'+cmp_type).clone();
			var i;
			var attrs = this_el[0].getAttributeNames();
			for (i in attrs) {
				//console.log(i, attrs[i],  this_el.attr(attrs[i]));
				$(design_el).attr(attrs[i], this_el.attr(attrs[i]));
				//$(real_el).html(this_el.html());
				if (cmp_type == 'textbox' || cmp_type == 'textarea') {
					$(design_el).val(this_el.val());
				}
			}
			this_el.addClass('removing');
			this_el.parent().append(design_el);
			//console.log(real_el.parent());
		}
		
		//initComponent(design_el);
	});
	
	project_tmp.find('.removing').remove();
	$('#root #main_center').html('');
	//console.log('TEST', project_tmp.find('> .component'));
	$('#root #main_center').append(project_tmp.find('> .component'));
	
	$('#root #main_center .component').each(function(){
		initComponent($(this));
	});
	
	updateElementList();
}

function initComponent(cmp_el) {
	
	if (!cmp_el.hasClass('container')) {
		cmp_el.draggable({snap: '#root #main_center', grid: [ 10, 10 ]});
	} else {
		//cmp_el.append('<div id=xx class="hndl ui-icon ui-icon-arrow-4"></div>');
		//cmp_el.draggable({snap: '#root #main_center', grid: [ 10, 10 ], handle:'.hndl'});
		cmp_el.css('cursor', 'crosshair');
	}
	cmp_el.resizable({snap: '#root #main_center', handles: 'n, e, s, w, ne, se, nw, sw', grid: [ 10, 10 ]});
	
	$(cmp_el).unbind('click').bind('click', function(e){
		//console.log(e);
		e.preventDefault();
		var tgt = e.target;
		if (!$(tgt).hasClass('component')) {
			tgt = $(tgt).closest('.component')[0];
		}
		var tgt_id = $(tgt).attr('id');
		if ($('.clicked').attr('id') == tgt_id) {
			console.log('already selected...');
			return;
		}
		$('.clicked').removeClass('clicked').resizable('destroy');
		$(tgt).addClass('clicked');
		$(tgt).resizable({snap: '#root #main_center', handles: 'n, e, s, w, ne, se, nw, sw', grid: [ 10, 10 ]});
		fillPropertiesTable();
		$('.project_element').removeClass('selected');
		$('[el_id='+ tgt_id +']').addClass('selected');
	});
}

function newComponent() {
	var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
	//var cmp_type = selected_new_cmp.replace('new_', '');
	var cmp_id = cmp_type + '_' + Date.now()+''+parseInt(Math.random()*1000);
	
	var cmp_left = snapToGrid($('#new_tmp_item').css('left'));
	var cmp_top = snapToGrid($('#new_tmp_item').css('top'));
	var cmp_width = snapToGrid($('#new_tmp_item').css('width'));
	var cmp_height = snapToGrid($('#new_tmp_item').css('height'));
	
	$('#new_tmp_item').css({'left': -5000, 'top':-5000, 'width':0, 'height':0})/*.hide()*/;
	//$('#root #main_center > #new_tmp_item').resizable('destroy');
	
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
	
	cmp_el = $('#templates > .design.' + cmp_type).clone().css(cmp_css).attr('id', cmp_id).addClass('component');
	cmp_el.attr('cmp_type', cmp_type);
	//$('#root #main_center').append(cmp_el);
	area.append(cmp_el);
	updateElementList();
	
	initComponent(cmp_el);
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
	
	for (i in js_el) {
		js_prop = js_el[i];
		prop_type = typeof(js_prop);
		if (prop_type == 'number' || prop_type == 'string' || prop_type == 'boolean' || js_prop === null) {
			if (i == 'innerHTML' || i == 'outerHTML') {
				continue;
			}
			table_html+= "<tr><td>" + i + "</td><td>" + js_prop + "</td></tr>";
		}
	}
	$('#properties > table').html(table_html);
	
	/*
	// SORT:
	var table = $('#properties > table');
	var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
	//this.asc = !this.asc
	this.asc = true;
	if (!this.asc){rows = rows.reverse()}
	for (var i = 0; i < rows.length; i++){table.append(rows[i])}
	*/
	
	/*for (i in cmp_properties) {
		js_prop = js_el[cmp_properties[i]];
		prop_type = typeof(js_prop);
		table_html+= "<tr><td>" + cmp_properties[i] + "</td><td>" + js_prop + "</td></tr>";
	}*/
	$('#properties > table').html(table_html);
}


function updateElementList() {
	var list = $('#element_list');
	list.html('<div>Main page</div>');
	$('#root #main_center .container.form').each(function(){
		var el_id = $(this).attr('id');
		list.append('<div class=project_element el_id='+el_id+'>'+ el_id +'</div>');
	});
	
	$('.project_element').unbind('click').bind('click', function(e){
		//var me = $(this);
		$('.project_element').removeClass('selected');
		$(this).addClass('selected');
		var element_id = $(this).attr('el_id');
		$('#'+element_id).trigger('click');
	});
}

function deleteElement() {
	$('.clicked').remove();
	updateElementList();
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


