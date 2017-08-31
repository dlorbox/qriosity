var quiz = {}
//Category ajax call-----------------------------------------
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
			$('.difficultyChoice').text("Easy");
			// console.log(categoryName);
		});
	});
}
//Making the API Call to receive the quiz attributes-----------------------------------
quiz.questionNumber = function(){
	
	$('.categories').on('change', function(){
		var catId = $('.categories').val();
		$('.difficulty').css("display", "block");
		$('.difficultyChoice').css("display", "block");
		$.ajax({
			url: `https://opentdb.com/api_count.php?category=${catId}`,
			method:'GET',
			dataType:'json'
		}).then(function(res){
			console.log(res);
			$('.difficulty').on('change', function(){
				$('.numberOfQuestions').css("display", "block")
				if ($('.difficulty').val() == 1){
					// console.log(res.category_question_count.total_easy_question_count);
					if (res.category_question_count.total_easy_question_count >50){
						console.log('easy');
						$('.difficultyChoice').text("Easy");
						$('.numberOfQuestions').attr({"max" : 50});
					} else{
						$('.numberOfQuestions').attr({"max" : res.category_question_count.total_easy_question_count});
					}
				}else if($('.difficulty').val() == 2){
					console.log('med');
					$('.difficultyChoice').text("Medium");
					// console.log(res.category_question_count.total_medium_question_count);
					if (res.category_question_count.total_medium_question_count >50){
						$('.numberOfQuestions').attr({"max" : 50});
					} else{
					$('.numberOfQuestions').attr({"max" : res.category_question_count.total_medium_question_count});
					}
				}else if($('.difficulty').val() == 3){
					console.log('hard');
					$('.difficultyChoice').text("Hard");
					console.log(res.category_question_count.total_hard_question_count);
					if (res.category_question_count.total_hard_question_count >50){
						$('.numberOfQuestions').attr({"max" : 50});
					} else{
					$('.numberOfQuestions').attr({"max" : res.category_question_count.total_hard_question_count});
					}
				}


				
			});
		});
	});

};
// The API call to get the appropriate quiz----------------------------------------------
quiz.get = function(){
	$('.startQuiz').on('click', function(e){
		e.preventDefault();
		let category = $('.categories').val();
		let difficulty = "";
		let numberOfQuestions = $('.numberOfQuestions').val();

		if($('.difficulty').val() == 1){
			difficulty = "easy";
		}else if($('.difficulty').val() == 2){
			difficulty = 'medium';
		}else if($('.difficulty').val() == 3){
			difficulty = "hard";
		}
		$.ajax({
			url: `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}`,
			method: "GET",
			dataType: "json"
		}).then(function(res){
			console.log(res.results)
			for(var i = 0; i < res.results.length; i++){
				$('.correctAnswers').append(`<h4>${res.results[i].question}<h4>`);
				$('.correctAnswers').append(`<h5>${res.results[i].correct_answer}<h5>`);
			}
			
			quiz.quiz(res);
			});
			$('.splash').hide();
			$('.quiz').show();
		});
}
//create a function to get correct and incorrect answers in an array
//randomize the order of the array
//append array items to the buttons on the quiz section of the HTML
//append the question above the answer buttons
// store the input to player 1 and player 2
quiz.quiz = function(results){
	let playerOne = 0;
	let playerTwo = 0;
	let selection = "";
	let correctAnswer = results.results[0].correct_answer;
	let answers = [];

	//variables for length of array to stop the quiz at end of questions

	const length = results.results.length;

	let quizNumber = 0;

	// console.log(length);

	//Quiz responses---------------------------------
	answers = results.results[quizNumber].incorrect_answers;
	answers.push(results.results[quizNumber].correct_answer);


	//function for shuffling answers within the answers array------------------
	function shuffleAnswers(answers) {
	    for (var i = answers.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = answers[i];
	        answers[i] = answers[j];
	        answers[j] = temp;
	    }
	    return answers;
	}
	shuffleAnswers(answers);
	for(var i = 0; i < 4; i++) {
		$('.answer' + [i+1]).html(answers[i]);
		$('.answer' + [i+1]).val(answers[i]);
	}
	




	//function to put the trivia question on the page--------------------
	$('.question').html(results.results[quizNumber].question);



	// function to get input---------------------------
	turnPlayerOne();
	// player one ------------------------------
	function turnPlayerOne(){
		if (results.results[quizNumber].type == 'boolean'){
			$('.answer3').hide();
			$('.answer4').hide();
		}else{
			$('.answer3').show();
			$('.answer4').show();
		}
		$('.submitAnswer').hide();
		$('.playerIndicator').text("Player One");
		$('.answer').on("click", function(){
			selection = "";
			selection = ($(this).val());
			$('.submitAnswer').show();
		});
		$('.submitAnswer').one('click', function(e){
			e.preventDefault();
			if (selection == correctAnswer){
				playerOne = playerOne + 1;
				selection = "";
				turnPlayerTwo();
			}else{
				selection = "";
				turnPlayerTwo();
			}
		});
	}
	// player two ----------------------------
	function turnPlayerTwo(){
		$('.submitAnswer').hide();
		$('.playerIndicator').text("Player Two");
		$('.answer').on("click", function(){
			selection = "";
			selection = ($(this).val());
			$('.submitAnswer').show();
		});
		$('.submitAnswer').one('click', function(e){
			e.preventDefault();
			if (selection == correctAnswer){
				playerTwo = playerTwo + 1;
				selection = "";
				nextQuestion();
			}else{
				selection = "";
				nextQuestion();
			} 
		});
	}
	let nextQuestion = () => {
		if (quizNumber == length - 1) {
			$('.quiz').hide();
			$('.scoreBoard').show();
			$('.playerOne__score').text(playerOne);
			$('.playerTwo__score').text(playerTwo);
		} else {
			quizNumber = quizNumber + 1;
			answers = results.results[quizNumber].incorrect_answers;
			answers.push(results.results[quizNumber].correct_answer);
			shuffleAnswers(answers);
			for(var i = 0; i < 4; i++) {
				$('.answer' + [i+1]).html(answers[i]);
				$('.answer' + [i+1]).val(answers[i]);
			}
			$('.question').html(results.results[quizNumber].question);
			turnPlayerOne();
		}
	};
};





//Init and document ready-----------------------
quiz.init = function(){
	quiz.category();
	quiz.questionNumber();
	quiz.get();
}
$(function(){
	quiz.init();
});

