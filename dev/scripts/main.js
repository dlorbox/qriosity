var quiz = {}
quiz.category = function(category){
	$.ajax({
		url: `https://opentdb.com/api_category.php`,
		method: "GET",
		dataType: "json"
	}).then(function(res){
		console.log(res);
	});
}
// quiz.numberOfQuestions = function(){
// 	$.ajax({
// 		url: `https://opentdb.com/api_count.php?category=${selectedCategory}`,
// 		method: "GET",
// 		dataType: "json"
// 	})
// }
quiz.test = function() {
	console.log('hi');
}
quiz.init = function(){
	quiz.category();
}
$(function(){
	quiz.init();
});

