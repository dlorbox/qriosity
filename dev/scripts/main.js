var quiz = {}
quiz.category = function(category){
	$.ajax({
		url: `https://opentdb.com/api_category.php`,
		method: "GET",
		dataType: "json"
	}).then(function(res){
		let categoryNames = res.trivia_categories;
		console.log(res);
		for(var i = 0; i < categoryNames.length; i++){
			console.log(categoryNames[i].name);
		}
	});
}

quiz.test = function() {
	console.log('hi');
}
quiz.init = function(){
	quiz.category();
}
$(function(){
	quiz.init();
});

