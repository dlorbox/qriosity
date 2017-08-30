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
			quiz.questionNumber();
			// console.log(categoryName);
		});
	});
}

quiz.questionNumber = function(){
	$('.categories').on('change', function(){
		var catId = $('.categories').val();
		console.log(catId);
	});
	// $.ajax({
	// 	url: `https://opentdb.com/api_count.php?category=${catId}`,
	// 	method:'GET',
	// 	dataType:'json'
	// }).then(function(res){
	// 	// let categoryId = catId.id;
	// 	console.log(res);
	// });

};




//Init and document ready
quiz.init = function(){
	quiz.category();
}
$(function(){
	quiz.init();
});

