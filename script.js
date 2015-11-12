function displayTime() {
	var now,
		h,
		m,
		s,
		displayTime;

	now = new Date();
	h = now.getHours();
	m = now.getMinutes();
	s = now.getSeconds();

	displayTime = padZero(h) + " : " + padZero(m) + " : " + padZero(s);
	document.querySelector('#current-time').innerHTML = displayTime;

	/* ==== */
	var canvas = document.querySelector('canvas');
	var context = canvas.getContext('2d');

	var clockRadius = 100;
	var clockX = canvas.width / 2;
	var clockY = canvas.height / 2;

	Math.TAU = 2 * Math.PI;

	function drawArm(progress, weight, length, color) {
		var armRadians = (Math.TAU * progress) - (Math.TAU / 4);
		var armLength = clockRadius * length;
		var targetX = clockX + Math.cos(armRadians) * armLength;
		var targetY = clockY + Math.sin(armRadians) * armLength;

		// hour (red)
		context.lineWidth = weight;
		context.strokeStyle = color;

		context.beginPath();
		context.moveTo(clockX, clockY);
		context.lineTo(targetX, targetY);
		context.stroke();
	}

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawArm(h / 12, 10, .6, 'black');
	drawArm(m / 60, 5, .9, 'red');
	drawArm(s / 60, 2, 1, 'blue');	
}

function padZero(num) {
	var res = String(num);
	if (num < 10) {
		res = "0" + res;
	}
	return res;
}

function startTimer() {
	setInterval(displayTime, 1000);
	displayTime();
}

document.addEventListener('DOMContentLoaded', startTimer);

