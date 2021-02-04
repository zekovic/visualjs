


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
	
}

function initForm(el) {
	var arg = {handle:'.titlebar'};
	console.log(el);
	if (!$(el).closest('#export_preview_panel').length) {
		var res = getSnapResolution();
		if (res) { arg.grid = [ res, res ]; }
	}
	$(el).draggable(arg);
	$(el).find('.form-close').unbind('click').bind('click', function(){
		$(this).closest('.form').hide();
	});
}

function getSnapResolution() {
	var res = $('#tool_resolution');
	return !res.length ? null : parseInt(res.val());
}