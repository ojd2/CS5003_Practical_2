// Init JS

function init() {
		$("#q_id, #q_submit, #rep_submit").change(function(event) {
		alert('clicked');
		console.log(event);

		// Get data form question input element. 
		var entry = $("#q_id").val();
		});
}
$(init);