"use strict";

var module = (function() {

	var display;
	var canvas;
	var context;
	var clockRadius;
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

	function init() {
		// fallback for animation function
		requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame;

		// set vars
		display = document.querySelector('#current-time');
		canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');
		clockRadius = canvas.height / 2;
		context.translate(clockRadius, clockRadius);

		Math.TAU = 2 * Math.PI;

		iteration = 0;
		totalIterations = 15;
		hourChanged = false;
		minuteChanged = false;
		secondChanged = false;

		// update clock and display
		now = new Date();
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
			context.clearRect(-clockRadius, -clockRadius, canvas.width, canvas.height);

			// redraw new clock arms
			drawClock();

			requestAnimationFrame( animateClock );
			iteration++;
		}
	}

	function drawArm(progress, weight, length, color) {
		var armRadians = (Math.TAU * progress) - (Math.TAU / 4);
		var armLength = clockRadius * length;
		var targetX = Math.cos(armRadians) * armLength;
		var targetY = Math.sin(armRadians) * armLength;

		context.lineWidth = weight;
		context.lineCap = "round";
		context.strokeStyle = color;

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(targetX, targetY);
		context.stroke();
	}

	function drawClock() {
		drawFace(context, clockRadius);
		drawNumbers(context, clockRadius);

		drawArm(ht / 12, 9, .4, 'black');
		drawArm(mt / 60, 9, .6, 'black');
		drawArm(st / 60, 2, .8, 'black');
	}

	function drawFace(ctx, radius) {
		radius = radius * .95;

		// white bg
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'floralwhite';
		ctx.fill();

		// border
		ctx.lineWidth = radius * 0.06;
		ctx.stroke();

		// center
		ctx.beginPath();
		ctx.arc(0, 0, 6, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
	}

	function drawNumbers(ctx, radius) {
		var ang;
		var num;

		ctx.font = radius * 0.15 + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		for (num = 1; num <= 12; num++){
			ang = num * Math.PI / 6;
			ctx.rotate(ang);
			ctx.translate(0, -radius * 0.8);
			ctx.rotate(-ang);
			ctx.fillText(num.toString(), 0, 0);
			ctx.rotate(ang);
			ctx.translate(0, radius * 0.8);
			ctx.rotate(-ang);
		}
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