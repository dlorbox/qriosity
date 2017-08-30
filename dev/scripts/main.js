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
			// console.log(categoryName);
		});
	});
}

quiz.questionNumber = function(){
	$('.categories').on('change', function(){
		var catId = $('.categories').val();
		$.ajax({
			url: `https://opentdb.com/api_count.php?category=${catId}`,
			method:'GET',
			dataType:'json'
		}).then(function(res){
			if ($('.difficulty').val() == 1){
				console.log(res.category_question_count.total_easy_question_count);
				if (res.category_question_count.total_easy_question_count >50){
					$('.numberOfQuestions').attr({"max" : 50});
				} else{
					$('.numberOfQuestions').attr({"max" : res.category_question_count.total_easy_question_count});
				}
			}else if($('.difficulty').val() == 2){
				console.log(res.category_question_count.total_medium_question_count);
				if (res.category_question_count.total_medium_question_count >50){
					$('.numberOfQuestions').attr({"max" : 50});
				} else{
				$('.numberOfQuestions').attr({"max" : res.category_question_count.total_medium_question_count});
				}
			}else if($('.difficulty').val() == 3){
				console.log(res.category_question_count.total_hard_question_count);
				if (res.category_question_count.total_hard_question_count >50){
					$('.numberOfQuestions').attr({"max" : 50});
				} else{
				$('.numberOfQuestions').attr({"max" : res.category_question_count.total_hard_question_count});
				}
			}
		});
	});
};
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
		console.log(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}`);
		$.ajax({
			url: `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}`,
			method: "GET",
			dataType: "json"
		}).then(function(res){
			console.log(res);
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
	answers = results.results[0].incorrect_answers;
	answers.push(results.results[0].correct_answer);
	// console.log(answers, "unshuffled answers");


//function to get trivia question--------------------
	$('.question').text(results.results[0].question);


//function for shuffling answers within the answers array------------------
	function shuffleAnswers(answers) {
	    for (var i = answers.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = answers[i];
	        answers[i] = answers[j];
	        answers[j] = temp;
	    }
	    // console.log(answers, "shuffled answers");
	    return answers;
	}
	shuffleAnswers(answers);
	for(var i = 0; i < 4; i++) {
		$('.answer' + [i+1]).text(answers[i]);
		$('.answer' + [i+1]).val(answers[i]);
	}

// function to get input---------------------------
	turnPlayerOne();
// player one ------------------------------
	function turnPlayerOne(){
		$('.playerIndicator').text("Player One");
		$('.answer').on("click", function(){
			selection = "";
			selection = ($(this).val());
		});
		$('.submitAnswer').on('click', function(e){
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
	function turnPlayerTwo(){
		$('.playerIndicator').text("Player Two");
		$('.answer').on("click", function(){
			selection = "";
			selection = ($(this).val());
		});
		$('.submitAnswer').on('click', function(e){
			e.preventDefault();
			if (selection == correctAnswer){
				playerTwo = playerTwo + 1;
				selection = "";
			}else{
				selection = "";
			}
		});
	}
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

