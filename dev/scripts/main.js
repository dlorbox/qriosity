var quiz = {}

quiz.test = function() {
	console.log('hi');
}
quiz.init = function(){
	quiz.test();
}
$(function(){
	quiz.init();
});
