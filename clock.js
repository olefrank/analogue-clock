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
		drawSeconds(context, clockRadius);

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

		ctx.font = radius * 0.13 + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = '#666';

		for (num = 1; num <= 12; num++){
			if (num % 3 === 0) {
				ang = num * Math.PI / 6;
				ctx.rotate(ang);
				ctx.translate(0, -radius * 0.75);
				ctx.rotate(-ang);
				ctx.fillText(num, 0, 0);
				ctx.rotate(ang);
				ctx.translate(0, radius * 0.75);
				ctx.rotate(-ang);
			}
		}
	}

	function drawSeconds(ctx, radius) {
		var i;
		var angle;
		var secPos1 = radius - 20;
		var secPos2 = secPos1 - (secPos1 / 30);
		var x1;
		var y1;
		var x2;
		var y2;

		for (i = 0; i < 60; i++) {
			angle = i * (Math.PI * 2) / 60;
			x1 = Math.cos(angle) * secPos1;
			y1 = Math.sin(angle) * secPos1;
			x2 = Math.cos(angle) * secPos2;
			y2 = Math.sin(angle) * secPos2;

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			// mark every 5th min
			if (i % 5 === 0) {
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 3;
			}
			else {
				ctx.strokeStyle = '#666';
				ctx.lineWidth = 1;
			}
			ctx.stroke();
		}
	}

	function easeBackQuart(t, b, c, d) {
		var ts = (t /= d) * t;
		var tc = ts * t;
		return b + c * (-2 * ts * ts + 10 * tc + -15 * ts + 8 * t);
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