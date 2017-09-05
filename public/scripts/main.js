"use strict";

var quiz = {};
//Category ajax call-----------------------------------------
quiz.category = function (category) {
	$.ajax({
		url: "https://opentdb.com/api_category.php",
		method: "GET",
		dataType: "json"
	}).then(function (res) {
		var categoryNames = res.trivia_categories;
		categoryNames.forEach(function (categoryName) {
			// quiz.injectCategory(categoryName);
			$('.categories').append($('<option>').text(categoryName.name).val(categoryName.id));
			// console.log(categoryName);
		});
	});
};

//Making the API Call to receive the quiz attributes-----------------------------------
quiz.questionNumber = function () {
	$('.categories').on('change', function () {
		$('.categoryPlaceholder').remove();
		$('.difficulty').fadeIn("slow");
		var catId = $('.categories').val();
		$.ajax({
			url: "https://opentdb.com/api_count.php?category=" + catId,
			method: 'GET',
			dataType: 'json'
		}).then(function (res) {
			quiz.numberOfQuestionsToSelectorBar(res);
		});
	});
};
quiz.reset = function () {
	quiz.questionNumber();
	$('.numberOfQuestionsChoice').hide();
	$('.numberOfQuestions').hide();
	$('.startQuiz').hide();
};
//Putting the number of questions from the category onto the question select bar
quiz.numberOfQuestionsToSelectorBar = function (res) {
	$('.difficulty').on('change', function () {
		console.log(res);
		$('.numberOfQuestions').fadeIn("slow");
		$('.numberOfQuestions').css("display", "block");
		$('.numberOfQuestionsDisplay').fadeIn("slow");
		$('.numberOfQuestionsChoice').fadeIn("slow");
		$('.startQuiz').fadeIn("slow");
		$('.categories').on('click', function () {
			quiz.reset();
		});

		if ($('input[name="difficulty"]:checked').val() == 1) {
			console.log(res.category_question_count.total_easy_question_count);
			console.log('easy');
			if (res.category_question_count.total_easy_question_count > 50) {
				$('.numberOfQuestions').attr({ "max": 50 });
			} else {
				$('.numberOfQuestions').attr({ "max": res.category_question_count.total_easy_question_count });
			}
		} else if ($('input[name="difficulty"]:checked').val() == 2) {
			console.log('med');
			console.log(res.category_question_count.total_medium_question_count);
			if (res.category_question_count.total_medium_question_count > 50) {
				$('.numberOfQuestions').attr({ "max": 50 });
			} else {
				$('.numberOfQuestions').attr({ "max": res.category_question_count.total_medium_question_count });
			}
		} else if ($('input[name="difficulty"]:checked').val() == 3) {
			console.log('hard');
			console.log(res.category_question_count.total_hard_question_count);
			if (res.category_question_count.total_hard_question_count > 50) {
				$('.numberOfQuestions').attr({ "max": 50 });
			} else {
				$('.numberOfQuestions').attr({ "max": res.category_question_count.total_hard_question_count });
			}
		}
	});
};
//Change number of questions box value
quiz.numberOfQuestionsSelection = function () {
	$('.numberOfQuestions').on('mousemove', function () {
		var numberOfQuestions = $('.numberOfQuestions').val();
		$('.numberOfQuestionsChoice').text(numberOfQuestions);
	});
};
quiz.StartQuizOnSlide = function () {
	$('.numberOfQuestions').on('click', function () {});
};

// The API call to get the appropriate quiz----------------------------------------------
quiz.get = function () {
	$('.startQuiz').on('click', function (e) {
		e.preventDefault();
		var category = $('.categories').val();
		var difficulty = "";
		var numberOfQuestions = $('.numberOfQuestions').val();
		console.log(numberOfQuestions);

		if ($('.difficulty').val() == 1) {
			difficulty = "easy";
		} else if ($('.difficulty').val() == 2) {
			difficulty = 'medium';
		} else if ($('.difficulty').val() == 3) {
			difficulty = "hard";
		}
		$.ajax({
			url: "https://opentdb.com/api.php?amount=" + numberOfQuestions + "&category=" + category + "&difficulty=" + difficulty,
			method: "GET",
			dataType: "json"
		}).then(function (res) {
			console.log(res.results);
			for (var i = 0; i < res.results.length; i++) {
				$('.correctAnswers').append("<div><h4>" + res.results[i].question + "<h4><h5>" + res.results[i].correct_answer + "<h5></div>");
				// $('.correctAnswers').append(`<h5>${res.results[i].correct_answer}<h5>`);
			}

			quiz.quiz(res);
		});
		$('.splashContent').hide();
		$('.quiz').fadeIn("slow");
	});
};
//create a function to get correct and incorrect answers in an array
//randomize the order of the array
//append array items to the buttons on the quiz section of the HTML
//append the question above the answer buttons
// store the input to player 1 and player 2

quiz.quiz = function (results) {
	var playerOne = 0;
	var playerTwo = 0;
	var selection = "";
	var answers = [];

	//variables for length of array to stop the quiz at end of questions

	var length = results.results.length;

	var quizNumber = 0;

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
	for (var i = 0; i < 4; i++) {
		$('.answer' + [i + 1]).html(answers[i]);
		$('.answer' + [i + 1]).val(answers[i]);
	}

	//function to put the trivia question on the page--------------------
	$('.question').html(results.results[quizNumber].question);

	// function to get input---------------------------
	turnPlayerOne();
	// player one ------------------------------
	function turnPlayerOne() {
		if (results.results[quizNumber].type == 'boolean') {
			$('.answer3').hide();
			$('.answer4').hide();
		} else {
			$('.answer3').show();
			$('.answer4').show();
		}
		$('.submitAnswer').hide();
		$('.playerIndicator').text("Player One");
		$("body").keydown(function (event) {
			if (event.which == 81) {
				selection = $('.answer1').val();
				$('.submitAnswer').show();
			} else if (event.which == 87) {
				selection = $('.answer2').val();
				$('.submitAnswer').show();
			} else if (event.which == 69) {
				selection = $('.answer3').val();
				$('.submitAnswer').show();
			} else if (event.which == 82) {
				selection = $('.answer4').val();
				$('.submitAnswer').show();
			}
		});
		$('.answer').on("click", function () {
			selection = $(this).val();
			$('.submitAnswer').show();
		});
		$('.submitAnswer').one('click', function (e) {
			e.preventDefault();
			var correctAnswer = results.results[quizNumber].correct_answer;
			if (selection == correctAnswer) {
				playerOne = playerOne + 1;
				console.log(playerOne);
				selection = "";
				turnPlayerTwo();
			} else {
				selection = "";
				turnPlayerTwo();
			}
		});
	}
	// player two ----------------------------
	function turnPlayerTwo() {
		$('.submitAnswer').hide();
		$('.playerIndicator').text("Player Two");
		$("body").keydown(function (event) {
			if (event.which == 81) {
				selection = $('.answer1').val();
				$('.submitAnswer').show();
			} else if (event.which == 87) {
				selection = $('.answer2').val();
				$('.submitAnswer').show();
			} else if (event.which == 69) {
				selection = $('.answer3').val();
				$('.submitAnswer').show();
			} else if (event.which == 82) {
				selection = $('.answer4').val();
				$('.submitAnswer').show();
			}
		});
		$('.answer').on("click", function () {
			selection = $(this).val();
			$('.submitAnswer').show();
		});
		$('.submitAnswer').one('click', function (e) {
			var correctAnswer = results.results[quizNumber].correct_answer;
			e.preventDefault();
			// $('.answer').css('transform', 'rotate(36000000000deg)');
			if (selection == correctAnswer) {
				playerTwo = playerTwo + 1;
				selection = "";
				nextQuestion();
			} else {
				selection = "";
				console.log('');
				nextQuestion();
			}
		});
	}
	var nextQuestion = function nextQuestion() {
		if (quizNumber == length - 1) {
			$('.quiz').hide();
			$('.splash').fadeOut("slow");
			$('.scoreBoard').show();
			$('.playerOne__score').text("Player One: " + playerOne);
			$('.playerTwo__score').text("Player Two: " + playerTwo);
			if (playerOne > playerTwo) {
				$('.scoreBoard__winner').text("Player One Wins!");
			} else if (playerOne < playerTwo) {
				$('.scoreBoard__winner').text("Player Two Wins!");
			} else {
				$('.scoreBoard__winner').text("Tie game!");
			}
			$('.reset').on("click", function () {
				location.reload(true);
			});
		} else {
			quizNumber = quizNumber + 1;
			answers = results.results[quizNumber].incorrect_answers;
			answers.push(results.results[quizNumber].correct_answer);
			shuffleAnswers(answers);
			for (var i = 0; i < 4; i++) {
				$('.answer' + [i + 1]).html(answers[i]);
				$('.answer' + [i + 1]).val(answers[i]);
			}
			$('.question').html(results.results[quizNumber].question);
			turnPlayerOne();
		}
	};
};

//Init and document ready-----------------------
quiz.init = function () {
	quiz.category();
	quiz.questionNumber();
	quiz.numberOfQuestionsSelection();
	quiz.StartQuizOnSlide();
	quiz.get();
};
$(function () {
	quiz.init();
});