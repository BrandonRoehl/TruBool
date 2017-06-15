// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
// require_tree .
// require turbolinks



window.onload = function(){
	// Prefer native date pickers but fallback to js ones
	// if(!supportsInputType('date')){
		// $('input[type=date]').datepicker({
			// format: 'yyyy-mm-dd'
		// });
	// }
	// if(!supportsInputType('datetime-local')){
		// $('input[type=datetime-local]').datepicker({
			// format: 'yyyy-mm-dd hh:ii',
			// pickTime: true
		// });
	// }
}

// function supportsInputType(type){
	// var input = document.createElement('input');
	// input.setAttribute('type', type);
	// return input.type == type;
// }

function dialogWith(html) {
	$('#dialogContent').html(html);
	$('#dialog')[0].open()
	window.onload();
}
function dialogOrEval(xhr) {
	if(xhr.getResponseHeader('Content-Type').indexOf('text/javascript') == -1) {
		dialogWith(xhr.responseText);
	} else {
		eval(xhr.responseText);
	}
}
// Modal forms for new/edit
// <%= link_to 'Edit', [:edit, @foo], {remote: true} %>
$(document).on('ajax:success', 'a[data-remote]', function(e, data, status, xhr) {
	dialogOrEval(xhr);
	window.history.pushState({urlPath: e.currentTarget.href}, document.title, e.currentTarget.href);
});
$(document).on('ajax:error', 'a[data-remote]', function(e, xhr, status, error) {
	console.error('Content-Type: '+xhr.getResponseHeader('Content-Type')+'\nStatus: '+status);
	window.location.href = e.currentTarget.href;
});
// Form fields
// <%= form_for @foo, remote: true do |f| %>
$(document).on('ajax:success', 'form[data-remote]', function(e, data, status, xhr) {
	dialogOrEval(xhr);
});
$(document).on("ajax:error", 'form[data-remote]', function(e, xhr, status, error) {
	console.error(error);
	dialogWith(xhr.responseText);
});
$(document).on('ajax:send', 'form[data-remote]', function(xhr) {
	$(xhr.target).find('[type=submit]').addClass('disabled').val('Saving...');
});

