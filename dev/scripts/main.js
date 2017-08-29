var quizApp = {};

quizApp.getCategories = function(category) {
	$.ajax({
		url:'https://opentdb.com/api_category.php',
		method:'GET',
		dataType:'json'
		data: {
			format: 'json'
		}
	}).then(data){
		console.log(data);
	}
}
quizApp.init = function () {
	quizApp.getCategories();
}; 