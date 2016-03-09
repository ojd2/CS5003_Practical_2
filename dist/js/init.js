function init() {

		$("#q_submit").click(function(event) {
		//console.log(event);

		// Get data form question input element. 
		var entry = $("#q_id").val();
		console.log(entry);
		});

		$("#rep_submit").click(function(event) {
		//console.log(event);

		var li_tag = $(event.target).parent();
		var unique_id = $(li_tag).find("#unique_id");
		console.log(unique_id);
		console.log(unique_id.html());
		// Get data form question input element. 
		//event.parent
		// var question_id = $("#unique_id").val();
		// console.log('question id is:' + question_id);
		
		});
}
$(init);