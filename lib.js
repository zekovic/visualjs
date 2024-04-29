

var area, new_tmp_item, selected_new_cmp;
var snap_resolution;
var skin_name, skin_version;

$(window).on('load', function (e) {
	
	var ME = this;
	selected_new_cmp = $('#components > .selected').attr('id');
	
	snap_resolution = parseInt($('#tool_resolution').val());
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
			$('#root #main_center .container').css('cursor', 'default').draggable({/*snap: '#root #main_center',*/ grid: [ snap_resolution, snap_resolution ]}); /////
		} else {
			$('#root #main_center').css('cursor', 'crosshair');
			$('#root #main_center .container').css('cursor', 'crosshair');
			$('#root #main_center .panel.container.ui-draggable').draggable('destroy'); ///// form has titlebar
		}
		
		
		
	});
	
	$(window).unbind('keydown').bind('keydown', function(e){
		
		//console.log('KEY:', e.which, e.target.tagName);
		if (e.target.tagName.toLowerCase() == 'input') {
			
			if (e.which == 13 && $(e.target).attr('id') == 'property_input') {
				$('#property_input').trigger('blur');
			}
			if (e.which == 13 && $(e.target).attr('id') == 'tool_resolution') {
				$('#tool_resolution').trigger('blur');
			}
			
			return;
		}
		
		if (e.target.tagName.toLowerCase() == 'textarea') {
			if (e.which == 9) {
				e.preventDefault();
				var area = e.target;
				var txt = area.value;
				var sel_start = area.selectionStart;
				var sel_end = area.selectionEnd;
				//z.value = z.value.substring(0, z.selectionStart) +'\t'+ z.value.substring(z.selectionEnd, z.textLength);
				txt = txt.substring(0, sel_start) +'\t'+ txt.substring(sel_end);
				area.value = txt;
				sel_start++;
				area.selectionStart = sel_start;
				area.selectionEnd = sel_start;
			}
		}
		
		//return true;
		if (e.which == 46) {
			deleteElement();
		}
		if (e.which == 120) { // F9
			$('#export_generate').trigger('click');
			$('#export_preview').trigger('click');
			$('#tool_export').trigger('click');
		}
		if (e.which == 121) {
			$('#main_center_tabs > div').not('.tab-selected').trigger('click');
			e.preventDefault();
		}
		if (e.which == 27) { // Esc
			$('#cmp_select').trigger('click');
		}
	});
	
	$('#tool_resolution').bind('blur', function(){
		setGridResolution();
	});
	
	
	$('#properties > table').bind('click', function(e) {
		var clicked_el = e.target;
		if (clicked_el.tagName.toLowerCase() != 'td' || $(clicked_el).parent().index() == 0) {
			return;
		}
		var cmp = $('.clicked');
		var cmp_type = cmp.attr('cmp_type');
		var clicked_row = $(clicked_el).parent().children();
		var prop = clicked_row[0].textContent;
		var val = clicked_row[1].textContent;
		$(clicked_row[1]).html("<input id=property_input type=text />");
		$('#property_input').val(val).css({'width': '100px', 'border':'0px'});
		$('#property_input').focus().select();
		$('#property_input').bind('blur', function() {
			var txt_val = $(this).val();
			$('#property_input').remove();
			if (setProperty(cmp, prop, txt_val)) {
				$(clicked_row[1]).html(txt_val);
			} else {
				$(clicked_row[1]).html(val);
			}
			//cmp[0][prop] = txt_val;
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
		$(copied).show();
		copied.find('.component').each(function(){
			var this_el = $(this);
			var i;
			var el_id = this_el.attr('id');
			this_el.removeClass('clicked ui-draggable-handle ui-draggable ui-resizable');
			if (this_el.css('cursor') == 'crosshair'){
				this_el.css({cursor:'default'});
			}
			//this_el.find('.ui-resizable-handle').remove();
			var cmp_type = $(this).attr('cmp_type');
			var cmp_both_same = $('#templates .real.'+cmp_type).hasClass('design');
			if (!this_el.hasClass('container') && !cmp_both_same) {
				var real_el = $('#templates .real.'+cmp_type).clone();
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
		
		var events_script = '';
		var event_tabs = '';
		$('#root #main_center_wrap .component').each(function() {
			var this_el = $(this);
			var i;
			var el_id = this_el.attr('id');
			el_id = removeWrapFromId(el_id);
			this_el = $('#'+el_id);
			
			if (el_id != 'new_tmp_item' && el_id != 'main_center') {
				var el_events = getEvents(this_el);
				//console.log(el_id, el_events);
				for (i in el_events) {
					if (el_events[i] != '') {
						event_tabs = '\t'+el_events[i].split('\n').join('\n\t');
						events_script+= "\n$('#"+el_id+"').bind('"+i+".generated', function(){\n"+event_tabs+"\n});\n";
					}
				}
				
			}
		});
		
		copied.find('.ui-resizable-handle').remove();
		copied.find('.removing').remove();
		copied.find('.component.form').draggable({'handle':'.titlebar'}); // for code
		copied.find('.component').removeClass('design real cmplabel')/*.removeAttr('cmp_type')*/;
		
		var cache_arg = Math.random();
		$('#project_components_style').attr('href', 'components/'+skin_name+'/'+skin_name+'.css'+'?a='+cache_arg);
		$('#project_components_script').attr('src', 'components/'+skin_name+'/'+skin_name+'.js'+'?a='+cache_arg);
		
		$('#project_events_script').html("\n$(window).on('load.generated', function (e) {\n"+events_script+"\n});\n\n\t\t");
		
		var html_template = $('#template_project').html().replaceAll('template__', '');
		html_template = html_template.replaceAll("><link ", ">\n\t\t<link ");
		html_template = html_template.replaceAll("><script ", ">\n\t\t<script ");
		html_template = html_template.replaceAll("\n\t<script ", "\n\t\t<script ");
		html_template = html_template.replaceAll("\n\t<link ", "\n\t\t<link ");
		//html_template = html_template.replaceAll("</script>", "</script>\n");
		//html_template = html_template.replaceAll("<script", "\n\t\t<script");
		//html_template = html_template.replaceAll("</link>", "</link>\n");
		//html_template = html_template.replaceAll("<link", "\n\t\t<link");
		html_template = html_template.replace("</head>", "\n\t</head>");
		var whole_html = html_template.replace('___main_code_here___', copied.html());
		var run_preview_script = "<script type='text/javascript'>$(window).trigger('load')</script>";
		$('#export_code_panel > textarea').text(whole_html);
		$('#export_code_panel_main > textarea').text(copied.html());
		$('#export_preview_panel').html('');
		$('#export_preview_panel').append('<iframe>'+/*copied+*/'</iframe>');
		var preview_iframe = $('#export_preview_panel > iframe')[0];
		var iframe_document = preview_iframe.contentDocument || preview_iframe.contentWindow.document;
		iframe_document.write(whole_html.replace('</body>', run_preview_script+'</body>') );
		//copied.draggable('destroy');
		//$('#export_preview_panel .component').resizable('destroy');
		
		initForm($('#export_preview_panel .component.form')); // for preview
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
	
	
	$('#tab_design_editor').bind('click', function(){ openDesignEditor(); });
	$('#tab_code_editor').bind('click', function(){ openCodeEditor(); });
	
	$('#code_save').bind('click', function(){
		var element_id = $('#code_components_list').val();
		var event_name = $('#code_events_list').val();
		if (!element_id || !event_name) {
			return;
		}
		setEvent($('#'+element_id), event_name, $('#code_panel > textarea').val())
	});
	
	$('#code_exit').bind('click', function(){
		openDesignEditor();
	});
	
	
	$('#code_components_list').bind('change', function() {
		onCmpListChange();
	});
	$('#code_events_list').bind('change', function() {
		onEventListChange();
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
		//console.log(this);
		//console.log($(this).val());
	});
	
	$('#tool_skin').bind('change', function(e){
		setSkin();
	});
	
	initProject();
	
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
			
			/*if (width < 0) { width = Math.abs(width); xpos-= width-snap_resolution; }
			if (height < 0) { height = Math.abs(height); ypos-= height-snap_resolution; }*/
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
	
	//$(cmp_el).unbind('dblclick').bind('dblclick', function(e){
	$('#root #main_center').unbind('dblclick').bind('dblclick', function(e){
		var cmp_el = $(e.target);
		if (!cmp_el.hasClass('component')) {
			cmp_el = cmp_el.closest('.component');
		}
		console.log(cmp_el, cmp_el.attr('id'));
		//return;
		var el_id = cmp_el.attr('id');
		el_id = removeWrapFromId(el_id);
		//$('#code_editor #label_info').text(cmp_el.attr('cmp_type') + ' - ' + el_id);
		$('#code_editor textarea').text("");
		openCodeEditor();
		$('#code_components_list').val(el_id);
		onCmpListChange();
	});
	
	setSkin();
	setGridResolution();
	
	$('#root #main_center .component').each(function(){
		initComponent($(this));
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
	
	// custom imports
	//console.log('importing:', $('#loading_file')); //return;
	//$('#template_project template__head').append($('#loading_file head .custom'));
	$('#template_project template__head').append($('#loading_file title').parent().find('.custom'));
	var cache_arg = Math.random();
	$('#template_project template__head script.nocache').each(function(){
		var source_path = $(this).attr('src');
		if (source_path) {
			$(this).attr('src', source_path + '?a='+cache_arg);
		}
	});
	$('#template_project template__head link.nocache').each(function(){
		var source_path = $(this).attr('href');
		if (source_path) {
			$(this).attr('href', source_path + '?a='+cache_arg);
		}
	});
	
	
	var events_script_text = $('#loading_file #project_events_script').text();
	$('.component').unbind('.generated');
	$('#loading_file').html('');
	//eval(events_script_text);
	// assign events temporary
	//eval($('#loading_file #project_events_script').text());
	$(window).trigger('load.generated');
	
	$('#root #main_center .component').each(function(){
		var this_el = $(this);
		//initComponent($(this));
		
		var el_id = removeWrapFromId(this_el.attr('id'));
		this_el = $('#'+el_id);
		
		// save to components properties from temporary assigned events
		var events_arr = $._data(/*this*/ this_el[0], "events");
		for (i in events_arr) {
			for (j in events_arr[i]) {
				if (events_arr[i][j].namespace == 'generated') {
					var event_content = getFunctionBody(events_arr[i][j].handler.toString());
					event_content = event_content.split('\n\t').join('\n');
					setEvent(this_el, events_arr[i][j].type, event_content);
				}
			}
		}
		initComponent($(this));
	});
	
	// remove temporary assigned events
	$('.component').unbind('.generated');
	
	updateElementList();
}

function initComponent(cmp_el) {
	
	if (!cmp_el.hasClass('container')) {
		cmp_el.draggable({/*snap: '#root #main_center',*/ grid: [ snap_resolution, snap_resolution ]});
	} else {
		//cmp_el.append('<div id=xx class="hndl ui-icon ui-icon-arrow-4"></div>');
		//cmp_el.draggable({snap: '#root #main_center', grid: [ snap_resolution, snap_resolution ], handle:'.hndl'});
		cmp_el.css('cursor', 'crosshair');
	}
	cmp_el.resizable({/*snap: '#root #main_center',*/ handles: 'n, e, s, w, ne, se, nw, sw', grid: [ snap_resolution, snap_resolution ]});
	
	$(cmp_el).unbind('click').bind('click', function(e){
		//console.log(e);
		e.preventDefault();
		var tgt = e.target;
		if (!$(tgt).hasClass('component')) {
			tgt = $(tgt).closest('.component')[0];
		}

		/*$('#mouse_x').text($(cmp_el)[0].offsetLeft);
		$('#mouse_y').text($(cmp_el)[0].offsetTop);
		$('#mouse_x_drag').text($(cmp_el)[0].clientWidth);
		$('#mouse_y_drag').text($(cmp_el)[0].clientHeight);*/
		
		var tgt_id = $(tgt).attr('id');
		if ($('.clicked').attr('id') == tgt_id) {
			//console.log('already selected...');
			return;
		}
		$('.clicked').removeClass('clicked').resizable('destroy');
		$(tgt).addClass('clicked');
		$(tgt).resizable({/*snap: '#root #main_center',*/ handles: 'n, e, s, w, ne, se, nw, sw', grid: [ snap_resolution, snap_resolution ]});
		fillPropertiesTable();
		$('.project_element').removeClass('selected');
		$('[el_id='+ tgt_id +']').addClass('selected');
		
	});
	if (cmp_el.hasClass('form')) {
		initForm(cmp_el);
	}
	
	/*$(cmp_el).unbind('dblclick').bind('dblclick', function(e){
		console.log(e.target, $(e.target).attr('id'));
		var el_id = cmp_el.attr('id');
		//$('#code_editor #label_info').text(cmp_el.attr('cmp_type') + ' - ' + el_id);
		$('#code_editor textarea').text("");
		openCodeEditor();
		$('#code_components_list').val(el_id);
		onCmpListChange();
	});*/
}

function newComponent() {
	var cmp_type = $('#components > .selected').attr('id').replace('new_', '');
	//var cmp_type = selected_new_cmp.replace('new_', '');
	var count_that_type = $('#root #main_center .component[cmp_type='+cmp_type+']').length;
	var new_index = parseInt(count_that_type) + 1;
	//var cmp_id = cmp_type + '_' + Date.now()+''+parseInt(Math.random()*1000);
	var cmp_id = cmp_type + /*'_' +*/ new_index;
	var count_all = $('#root #main_center .component').length;
	var new_tab_index = parseInt(count_all) + 1;
	
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
	
	cmp_el = $('#templates > .design.' + cmp_type).clone().css(cmp_css)/*.attr('id', cmp_id)*/.addClass('component');
	cmp_el.attr('cmp_type', cmp_type);
	cmp_el.attr('cmp_version', skin_version);
	
	var has_focus_arr = ['button', 'textbox', 'textarea', /*'checkbox', 'radio',*/ 'combo'];
	if (has_focus_arr.indexOf(cmp_type) != -1) {
		cmp_el.attr('tabindex', new_tab_index);
	}
	
	// New name "Button 3"...
	var Cmp_type = cmp_type.charAt(0).toUpperCase() + cmp_type.slice(1);
	setLabel(cmp_el, Cmp_type+' '+new_index);
	
	//$('#root #main_center').append(cmp_el);
	area.append(cmp_el);
	//if (cmp_type == 'radio' || cmp_type == 'checkbox') {
		setProperty(cmp_el, 'id', cmp_id);
	//}
	updateElementList();
	
	
	initComponent(cmp_el);
	cmp_el.trigger('click');
	$('#new_tmp_item').html('');
}

function snapToGrid(value) {
	//return value;
	var resolution = snap_resolution;
	//console.log(snap_resolution);
	return parseInt(parseInt(value)/resolution) * resolution;
}

function fillPropertiesTable() {
	var js_el = $('.clicked')[0];
	var js_prop = null, prop_type = "";
	var i;
	var table_html = "<tr id=r1><td id=c1>Name</td><td id=c2>Value</td></tr>";
	table_html+= "<tr><td id=c1>&nbsp</td><td id=c2></td></tr>";
	
	prop_arr = getProperties(js_el);
	for (i in prop_arr) {
		table_html+= "<tr><td>" + i + "</td><td>" + prop_arr[i] + "</td></tr>";
	}
	
	/*
	// All js object properties:
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
	*/
	
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
		$('#'+element_id).show();
		$('#'+element_id).trigger('click');
	});
}

function deleteElement() {
	$('.clicked').remove();
	updateElementList();
}

function openCodeEditor() {
	$('#main_center_tabs > div').removeClass('tab-selected');
	$('#main_center_tabs > div#tab_code_editor').addClass('tab-selected');
	
	updateCodeComponentsList();
	
	$('#main_center_wrap').hide();
	$('#code_editor').show();
	$('#code_panel > textarea').focus();
}

function updateCodeComponentsList() {
	var all_cmp_list = $('#code_components_list');
	var options_html = '<option></option>';
	$('#root #main_center .component').each(function(){
		var cmp_id = $(this).attr('id');
		cmp_id = removeWrapFromId(cmp_id);
		if (cmp_id != 'new_tmp_item'){
			options_html+= '<option>' + cmp_id + '</option>';
		}
	});
	all_cmp_list.html(options_html);
}

function openDesignEditor() {
	$('#main_center_tabs > div').removeClass('tab-selected');
	$('#main_center_tabs > div#tab_design_editor').addClass('tab-selected');
	$('#code_editor').hide();
	$('#main_center_wrap').show();
}




function setGridResolution() {
	var res = $('#tool_resolution');
	if (!res.length) {
		snap_resolution = 1;
		return 1;
	}
	var res_val = parseInt(res.val());
	if (res_val > 30) {
		res_val = 30;
	}
	if (res_val < 1) {
		res_val = 1;
	}
	snap_resolution = res_val;
	
	var dot_color = "#000";
	if (res_val <= 6) { dot_color = "#555"; }
	if (res_val <= 3) { dot_color = "#888"; }
	
	var panel = $('#root > #main_center_wrap')[0];
	
	if (res_val > 1) {
		panel.style.background = "linear-gradient(90deg, #bbb "+(res_val-1)+"px, transparent 0%), "+
								"linear-gradient(#bbb "+(res_val-1)+"px, transparent 0%), "+dot_color;
		panel.style.backgroundSize = res_val+'px '+res_val+'px';
	} else {
		panel.style.background = "#bbb";
		panel.style.backgroundSize = "inherit";
	}
	
	res.val(res_val);
}

function setSkin() {
	skin_name = $('#tool_skin').val();
	skin_version = false;
	var skin_arr = skin_name.split('.');
	if (skin_arr.length == 2) {
		skin_name = skin_arr[0];
		skin_version = skin_arr[1];
	}
	var cache_arg = Math.random();
	$('#templates').load('components/'+skin_name+'/'+skin_name+'.html?a='+cache_arg);
	$('#components_style').load('components/'+skin_name+'/'+skin_name+'.css?a='+cache_arg);
	if (skin_version) {
		$('#main_center .component').attr('cmp_version', skin_version);
	}
	//console.log('SKIN NAME:', skin_name, skin_version);
	$.getScript('components/'+skin_name+'/'+skin_name+'.js?a='+cache_arg, function(){
		//console.log('callback...');
		components_loaded();
	});
}

function onCmpListChange() {
	var element_id = $('#code_components_list').val();
	if (!element_id) {
		return;
	}
	var event_combo = $('#code_events_list');
	var combo_html = '';
	var cmp_events = getEvents($('#'+element_id));
	for(var i in cmp_events) {
		combo_html+= "<option>"+i+"</option>";
	}
	event_combo.html(combo_html);
	onEventListChange();
}

function onEventListChange() {
	var element_id = $('#code_components_list').val();
	var event_name = $('#code_events_list').val();
	if (!element_id || !event_name) {
		return;
	}
	
	var event_text = getEventValue($('#'+element_id), event_name);
	$('#code_panel > textarea').val(event_text);
	$('#code_panel > textarea').focus();
}





function comparer(index) {
	return function(a, b) {
		var valA = getCellName(a, index), valB = getCellName(b, index)
		return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
	}
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
function getCellName(row, index){ return $(row).children('td').text() }


