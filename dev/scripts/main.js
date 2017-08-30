var quiz = {}
//Category ajax call
quiz.category = function(category){
	$.ajax({
		url: `https://opentdb.com/api_category.php`,
		method: "GET",
		dataType: "json"
	}).then(function(res){
		let categoryNames = res.trivia_categories;
		categoryNames.forEach(function(categoryName){
			quiz.injectCategory(categoryName.name);
		});
	});
}
quiz.injectCategory = function(name){
	console.log(name);
}




//Init and document ready
quiz.init = function(){
	quiz.category();
}
$(function(){
	quiz.init();
});

