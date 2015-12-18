"use strict";

var module = (function() {

	var canvas;
	var context;
	var clockRadius;
	var clockX;
	var clockY;
	var now;
	var requestAnimationFrame;
	var h;
	var ht;
	var m;
	var mt;
	var s;
	var st;
	var iteration;
	var totalIterations;
	var hourChanged;
	var minuteChanged;
	var secondChanged;
	var display;

	function init() {
		// fallback for animation function
		requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame;

		// set vars
		canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');
		clockRadius = 100;
		clockX = canvas.width / 2;
		clockY = canvas.height / 2;
		Math.TAU = 2 * Math.PI;
		now = new Date();
		iteration = 0;
		totalIterations = 15;
		hourChanged = false;
		minuteChanged = false;
		secondChanged = false;
		display = document.querySelector('#current-time');


		// update clock and display
		updateClock(now);
		updateDisplay(now);

		// start timer on load
		document.addEventListener('DOMContentLoaded', startTimer);
	}

	function getFormattedDisplayTime(date) {
		if (date instanceof Date) {
			return padZero( date.getHours() ) + " : " + padZero( date.getMinutes() ) + " : " + padZero( date.getSeconds() );
		}
	}

	function padZero(num) {
		var res = String(num);
		if (num < 10) {
			res = "0" + res;
		}
		return res;
	}

	function updateDisplay(date) {
		var displayTime = getFormattedDisplayTime(date);
		display.innerHTML = displayTime;
	}

	function updateClock(date) {
		if (date instanceof Date) {
			if (date.getHours() !== h) {
				h = date.getHours();
				hourChanged = true;
			}
			if (date.getMinutes() !== m) {
				m = date.getMinutes();
				minuteChanged = true;
			}
			if (date.getSeconds() !== s) {
				s = date.getSeconds();
				secondChanged = true;
			}
			animateClock();
		}
	}

	function animateClock() {
		if (iteration === totalIterations) {
			hourChanged = false;
			minuteChanged = false;
			secondChanged = false;
			iteration = 0;
		}
		else {
			if (hourChanged) {
				ht = easeBackQuart(iteration, h-1, 1, totalIterations);
			}
			if (minuteChanged) {
				mt = easeBackQuart(iteration, m-1, 1, totalIterations);
			}
			if (secondChanged) {
				st = easeBackQuart(iteration, s-1, 1, totalIterations);
			}

			// clear former clock
			context.clearRect(0, 0, canvas.width, canvas.height);

			// redraw new clock arms
			drawArm(ht / 12, 10, .6, 'black');
			drawArm(mt / 60, 5, .9, 'red');
			drawArm(st / 60, 2, 1, 'blue');

			requestAnimationFrame( animateClock );
			iteration++;
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

	function startTimer() {
		setInterval(function() {
			now = new Date();
			updateClock(now);
			updateDisplay(now);
		}, 1000);
	}

	init();

})(document);