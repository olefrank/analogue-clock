

var module = (function() {

	var canvas;
	var context;
	var clockRadius;
	var clockX;
	var clockY;

	function init() {
		canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');
		clockRadius = 100;
		clockX = canvas.width / 2;
		clockY = canvas.height / 2;
		Math.TAU = 2 * Math.PI;

		updateDisplay(new Date());

		document.addEventListener('DOMContentLoaded', startTimer);
	}

	function getFormattedDisplayTime(date) {
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		return padZero(h) + " : " + padZero(m) + " : " + padZero(s);
	}


	var h;
	var h1;
	var h11;
	var m;
	var m1;
	var m11;
	var s;
	var s1;
	var s11;

	var iteration = 0;
	var totalIterations = 45;
	var progressPct = 0;
	var hourChanged = false;
	var minuteChanged = false;
	var secondChanged = false;
	var display = document.querySelector('#current-time');

	var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	function updateDisplay(date) {
		if (date instanceof Date) {

			if (date.getHours() !== h) {
				hourChanged = true;
				h = date.getHours();
			}
			else {
				hourChanged = false;
			}
			if (date.getMinutes() !== m) {
				m = date.getMinutes();
				minuteChanged = true;
			}
			else {
				minuteChanged = false;
			}
			if (date.getSeconds() !== s) {
				s = date.getSeconds();
				secondChanged = true;
			}
			else {
				secondChanged = false;
			}

			iteration = 0;
			progressPct = 0

			// get time to displau
			var displayTime = getFormattedDisplayTime(date);
			// update display
			display.innerHTML = displayTime;
		}
		else {
			iteration++;
			progressPct = iteration / totalIterations;
		}

		if (iteration <= totalIterations) {

			// clear former clock
			context.clearRect(0, 0, canvas.width, canvas.height);


			if (hourChanged) {
				h1 = h - 1 + progressPct;
				h11 = easeInOutExpo(iteration, h, 1, totalIterations);
				console.log("h1 ", h1);
			}
			if (minuteChanged) {
				m1 = m - 1 + progressPct;
				m11 = easeInOutExpo(iteration, m, 1, totalIterations);
				console.log("m1 ", m1);
			}
			if (secondChanged) {
				s1 = s - 1 + progressPct;
				s11 = easeOutExpo(iteration, s, 1, totalIterations);
				console.log("s1 ", s1);
			}

			// redraw new clock arms
			drawArm(h11 / 12, 10, .6, 'black');
			drawArm(m11 / 60, 5, .9, 'red');
			drawArm(s11 / 60, 2, 1, 'blue');

			requestAnimationFrame( updateDisplay );
		}
	}

	function drawArm(progress, weight, length, color) {
		var armRadians = (Math.TAU * progress) - (Math.TAU / 4);
		var armLength = clockRadius * length;
		var targetX = clockX + Math.cos(armRadians) * armLength;
		var targetY = clockY + Math.sin(armRadians) * armLength;

		context.lineWidth = weight;
		context.strokeStyle = color;

		context.beginPath();
		context.moveTo(clockX, clockY);
		context.lineTo(targetX, targetY);
		context.stroke();
	}

	function padZero(num) {
		var res = String(num);
		if (num < 10) {
			res = "0" + res;
		}
		return res;
	}

	function startTimer() {
		setInterval(function() {
			updateDisplay(new Date());
		}, 1000);
	}

	init();

})(document);