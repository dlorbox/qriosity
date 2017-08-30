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
			// quiz.injectCategory(categoryName);
			$('.categories').append($('<option>').text(categoryName.name).val(categoryName.id));
		});
	});
}

quiz.injectCategory = function(cat){
	console.log(cat);
	
}




//Init and document ready
quiz.init = function(){
	quiz.category();
}
$(function(){
	quiz.init();
});

