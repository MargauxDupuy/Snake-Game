function randomIntFromInterval(min, max){
	return Math.floor((Math.random() * (max - min) + min) / 20) * 20;
}


// Deactivate up/down scrolling with the directional arrows
document.body.onkeydown =function(event){
	if (event.keyCode === 38 || event.keyCode === 40){
		event.preventDefault();
	}
};


window.onload = function(){
	var canvas = document.getElementById('snake_canvas');
	var context = canvas.getContext('2d');

	var width = canvas.width = 500;
	var height = canvas.height = 300;

	//Random snake position
	var xAlea = randomIntFromInterval(0, width-20);
	var yAlea = randomIntFromInterval(0, height-20);

	var snake = [
		{x: xAlea, y: yAlea},
		{x: xAlea+20, y: yAlea},
		{x: xAlea+40, y: yAlea},
	];

	var dx=20;
	var dy=0;

	var score = 0;
	var bestScore = sessionStorage.getItem("BestScore");
	document.getElementById('bestScore').innerHTML = bestScore;

	var speed = 130;

	var btnStart = document.getElementById("snake_play");
	var btnPause = document.getElementById("snake_pause");

	var gamePaused;
	var gameStart;


	// Get and draw the snake applying drawPartSnake to each square
	function drawSnake(){
		snake.forEach(drawPartSnake)
	}


	function drawPartSnake(part){
		context.fillStyle = '#9F72FF';
		context.fillRect(part.x, part.y, 20, 20);

		context.fillStyle = 'black';
		context.strokeRect(part.x, part.y, 20, 20);
	}


	function updateSnake(){
		var head = {x: snake[0].x + dx, y: snake[0].y + dy};

		snake.unshift(head);

		// --- SCORE ---
		if (typeof(Storage) !== "undefined"){
			if (snake[0].x === xApple && snake[0].y === yApple){

				score++;

				// Increase speed
				if (speed > 50) {
					speed -= 2;
					runGame(speed);
				}

				document.getElementById('score').innerHTML = score;

				if (bestScore < score){
					bestScore = score;
				} else {
					bestScore = parseInt(bestScore);
				}

				sessionStorage.setItem("BestScore", bestScore);

				document.getElementById('bestScore').innerHTML = bestScore;
				createApple();

			} else {
				snake.pop();
			}
		} else {
			alert("sessionStorage i snot supported by your browser")
		}
	}

	function createApple(){
		xApple = randomIntFromInterval(0,width-20); // -20, so that the square is not cut off
		yApple = randomIntFromInterval(0,height-20);

		snake.forEach(function appleOnSnake(part){
			// If he apple is on the snake position
			if (part.x === xApple && part.y === yApple){
				createApple();
			}
		});
	}


	function drawApple(){
		context.fillStyle = '#65D1FF';
		context.fillRect(xApple, yApple, 20, 20);
		context.fillStyle = 'black';
		context.strokeRect(xApple, yApple, 20, 20);
	}

	// --- DEPLACEMENT ---
	var hist;

	document.addEventListener("keydown", changeDirection);

	function changeDirection(event){
		switch (event.keyCode){
			// To avoid half-tour, a break is made when the typed value is the inverse of the previous one
			case 37: // Link key
				if (hist===39) {break;}
				dx=-20;
				dy=0;
				hist = event.keyCode;
				break;

			case 38: // Up key
				if (hist===40) {break;}
				dy=-20;
				dx=0;
				hist = event.keyCode;
				break;

			case 39: // Right key
				if (hist===37) {break;}
				dx=20;
				dy=0;
				hist = event.keyCode;
				break;

			case 40: // Bottom key
				if (hist===38) {break;}
				dy=20;
				dx=0;
				hist = event.keyCode;
				break;
		}
	}


	function gameover(){
		//if the snake touches himself
		for (var i = 4; i < snake.length; i++){
			if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
				return true;
			}
		}

		//if the snake touches the wall
		/*with the walls
		var	leftWall = snake[0].x < 0;
	    var	rightWall = snake[0].x > width;
	    var	upWall = snake[0].y < 0;
	    var downWall = snake[0].y > height;
		if (leftWall || rightWall || upWall || downWall){
			return true
		}*/
	}


	function game(){
		if (gameover()){
			document.getElementById('gameover').innerHTML = "Perdu !";
			return;
		}

		if (snake[0].x < 0){
			snake[0].x = width;
		}

		if (snake[0].x > width){
			snake[0].x = 0;
		}

		if (snake[0].y < 0){
			snake[0].y = height;
		}

		if (snake[0].y > height){
			snake[0].y = 0;
		}

		// Remove old position
		context.clearRect(0, 0, width, height);
		drawApple();
		updateSnake();
		drawSnake();
	}

	function runGame(newspeed){
		if (typeof play !== "undefined") {
			clearInterval(play);
		}
		play = setInterval(game,newspeed);
	}


	// --- BUTTON START/RESTART ---
	btnStart.addEventListener("click", function(){
		btnStart.innerHTML = "Reset";
		startGame();
	});

	function startGame(){
		if (!gameStart) {
			createApple();
			runGame(speed);
			//play = setInterval(game,speed);
			gameStart = true;

		} else if (gameStart) {
			document.location.reload();
		}
	}


	// --- BUTTON PAUSE ---

	// If user click on pause button
	btnPause.addEventListener("click", function(){
		btnPause.innerHTML = "Continuer";
		pauseGame();
	});

	// If user press on P touch or space touch
	document.addEventListener("keydown", touchPause);
	function touchPause(event){
		if (event.keyCode === 80){
			pauseGame();
		}
	}

	function pauseGame(){
		play = clearInterval(play);
		if (!gamePaused){
			play = clearInterval(play);
			gamePaused = true;
		} else if (gamePaused) {
			btnPause.innerHTML = "Pause";
			play = setInterval(game, speed);
			gamePaused = false;
		}
	}
};
