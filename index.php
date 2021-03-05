<html>
<head>

<?php 
$cache_arg = time();
?>

<title>Visual Forms</title>

<script type="text/javascript" src="jquery-3.5.1.js"></script>
<script type="text/javascript" src="jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="jquery-ui-1.12.1.custom/jquery-ui.min.css"/>

<link id=all_style rel="stylesheet" type="text/css" href="style.css<?php echo "?a=$cache_arg" ?>"/>
<link id=project_style rel="stylesheet" type="text/css" href="project_style.css<?php echo "?a=$cache_arg" ?>"/>
<style type="text/css" id=components_style ></style> 
<script type="text/javascript" id=components_script></script>

<script type="text/javascript" src="lib.js<?php echo "?a=$cache_arg" ?>"></script>
<script type="text/javascript" src="project_lib.js<?php echo "?a=$cache_arg" ?>"></script>
<script type="text/javascript" src="components.js<?php echo "?a=$cache_arg" ?>"></script>
</head>
<body>
<div id=root>

<div id=main_top>
	<div id=main_menu class=hidden>
		<div>File</div>
		<div>Edit</div>
		<div>View</div>
		<div>Project</div>
		<div>Format</div>
		<div>Debug</div>
		<div>Run</div>
		<div>Query</div>
		<div>Diagram</div>
		<div>Tools</div>
		<div>Add-Ins</div>
		<div>Window</div>
		<div>Help</div>
	</div>
	
	<div id=toolbar class=icon-wrap>
		<div id=tool_open>OPEN</div>
		<div id=tool_save>SAVE</div>
		|
		<div id=tool_delete>DELETE</div>
		<span>DOCK:</span>
		<div id=tool_dock_left>Left</div>
		<div id=tool_dock_right>Right</div>
		<div id=tool_dock_top>Top</div>
		<div id=tool_dock_bottom>Bottom</div>
		|
		<div id=tool_export>EXPORT</div>
		|
		Snap to grid:
		<span><input id=tool_resolution type=text value=10 style="width:50px" /></span>
		|
		Skin:
		<span>
			<select id=tool_skin>
				<option value="default.blue">Default</option>
				<option value="default.gold">Default - Gold</option>
				<option value="default.green">Default - Green</option>
				<option value="win98">Windows 98</option>
				<option value="winxp">Windows XP</option>
				<option value="bootstrap">Bootstrap</option>
				<option value="cockpit">Cockpit</option>
			</select>
		</span>
	</div>
</div>

<div id=main_left>
	<div id=components>
		<div id=cmp_select class=selected title="Select element"><img src="components/cursor.png"/></div>
		
		<div id=new_label title="Label"><img src="components/label.png"/></div>
		<div id=new_textbox title="Textbox"><img src="components/textbox.png"/></div>
		<div id=new_textarea title="Textarea"><img src="components/textarea.png"/></div>
		<div id=new_form title="Form"><img src="components/form.png"/></div>
		<div id=new_button title="Button"><img src="components/button.png"/></div>
		<div id=new_checkbox title="Checkbox"><img src="components/checkbox.png"/></div>
		<div id=new_radio title="Radio button"><img src="components/radio.png"/></div>
		<div id=new_combo title="Dropdown box"><img src="components/combo.png"/></div>
		<div id=new_panel title="Panel"><img src="components/panel.png"/></div>
		<div id=new_table title="Table"><img src="components/table.png"/></div>
	</div>
</div>

<div id=main_center_wrap>
	<div id=main_center class='component container project'>
		<div id=new_tmp_item class=component></div>
		
	</div>
</div>

<div id=main_right>
	<div id=project_structure>
		<input id=file_opener type="file" id="file" style="display: none;">
		Project
		<span id=test>elements</span>
		<div id=element_list>
			<div>Main page</div>
		</div>
	</div>
	
	<div id=properties>
		<table>
			<tr id=r1> <td id=c1>Name</td><td id=c2>Value</td></tr>
			
		</table>
	</div>
</div>

<div id=main_down>
	<div id=coords_status>
		X: <span id=mouse_x> </span> 
		<span></span> 
		Y: <span id=mouse_y></span> 
		<span></span> 
		W: <span id=mouse_x_drag></span> 
		<span></span> 
		H: <span id=mouse_y_drag></span>
		<span></span> 
	</div>
</div>

</div>

<div id=templates class=hidden>
	
</div>

<div id=form_export class=hidden>
	<div class=icon-wrap id=export_toolbar>
		<div id=export_generate>Generate</div>
		<div id=export_code>All Code</div>
		<div id=export_code_main>Main Code</div>
		<div id=export_preview>Preview</div>
		<div id=export_exit>Exit</div>
	</div>
	
	<div class=export-tab id=export_code_panel ><textarea></textarea></div>
	<div class='export-tab hidden' id=export_code_panel_main><textarea></textarea></div>
	<div class='export-tab hidden' id=export_preview_panel></div>
</div>

<div id=code_editor class=hidden>
	<div class=icon-wrap id=code_toolbar>
		<div id=label_info></div>
		<div id=code_save>Save</div>
		<div id=code_exit>Exit</div>
	</div>
	<div id=code_panel ><textarea></textarea></div>
</div>


<div id=template_project class=hidden>
<template__html>
	<template__head>
		<title>Your project</title>
		
		<template__script type="text/javascript" src="jquery-3.5.1.js"></template__script>
		<template__script type="text/javascript" src="jquery-ui-1.12.1.custom/jquery-ui.min.js"></template__script>
		<template__link rel="stylesheet" type="text/css" href="jquery-ui-1.12.1.custom/jquery-ui.min.css"></template__link>
		
		<template__link rel="stylesheet" type="text/css" href="project_style.css"></template__link>
		<template__script type="text/javascript" src="project_lib.js"></template__script>
		
		<template__link rel="stylesheet" type="text/css" id="project_components_style" href=""></template__link>
		<template__script type="text/javascript" id="project_components_script" src=""></template__script>
	</template__head>
	<template__body>
		<template__div id="main_center_wrap">
			___main_code_here___
		</template__div>
	</template__body>
</template__html>

</div>

<div id=loading_file style="display: none;"></div>



</body>
</html>