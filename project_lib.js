


$(window).on('load', function (e) {
	
	initLoadedPage();
	//$('.component.form').draggable({handle:'.titlebar'});
	
	/*$('.form-close').each(function(){
		
	});
	$('.form-close').bind('click', function(){
		$(this).closest('.form').hide();
	});*/
});

function initLoadedPage() {
	initForm($('.component.form'));
	//initAllWrapInputs();
}

function initForm(el) {
	var arg = {handle:'.titlebar'};
	//console.log(el);
	if (!$(el).closest('#export_preview_panel').length) {
		var res = getSnapResolution();
		if (res) { arg.grid = [ res, res ]; }
	}
	$(el).draggable(arg);
	$(el).find('.form-close').unbind('click').bind('click', function(){
		$(this).closest('.form').hide();
	});
}

function removeWrapFromId(el_id) {
	if (el_id.indexOf("_wrap") == el_id.length-5) {
		el_id = el_id.substring(0, el_id.length-5);
	}
	return el_id;
}
		
function initAllWrapInputs() {
	initWrapInput("#main_center_wrap [id$=_wrap]");
}

function initWrapInput(cmp_el) {
	$(cmp_el).each(function(){
		$(this).bind('val', function(new_val) {
			var input_cmp = $(this).find('input');
			console.log("INPUT FOUND:", input_cmp, input_cmp.val());
			if (new_val === undefined) {
				return input_cmp.val();
			} else {
				input_cmp.val(new_val);
			}
		});
	});
}

function getSnapResolution() {
	var res = $('#tool_resolution');
	return !res.length ? null : parseInt(res.val());
}