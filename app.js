console.log('start ...');

var _rawContentId = 'raw_content';
var _porcessedContentId = 'processed_content';
var _shiftDurationPrefix = 'shift_duration';
var _shiftDurationHours = _shiftDurationPrefix + '_hours';
var _shiftDurationMinutes = _shiftDurationPrefix + '_minutes';
var _shiftDurationSeconds = _shiftDurationPrefix + '_seconds';
var _shiftDurationMilliseconds = _shiftDurationPrefix + '_milliseconds';


function setContent(elmentId, content) {
	document.getElementById(elmentId).value = content;
}

function getContent(elmentId) {
	return document.getElementById(elmentId).value;
}

function handleFiles(files) {
	debugger;
	for (var i = 0; i < files.length; i++) {
		debugger;
		var file = files[i];
		var reader = new FileReader();

		reader.onload = function (e) {
			debugger;
			setContent(_rawContentId, e.target.result);
		}

		reader.readAsText(file);
	}
}

function process() {
	debugger;
	var content = getContent(_rawContentId);
	var shiftDuration = moment.duration({
		milliseconds: Number(getContent(_shiftDurationMilliseconds)),
		seconds: Number(getContent(_shiftDurationSeconds)),
		minutes: Number(getContent(_shiftDurationMinutes)),
		hours: Number(getContent(_shiftDurationHours)),
		days: 0,
		weeks: 0,
		months: 0,
		years: 0
	});

	var timeCode_Fromat = "HH:mm:ss,SSS";
	var timeCode_RgxPattern = '(\\d{2}:\\d{2}:\\d{2},\\d{3})';
	var timeCodesLine_RgxPattern = timeCode_RgxPattern + '.*-->.*' + timeCode_RgxPattern + '(?:\\r?\\n)';
	//hours:minutes:seconds,milliseconds (00:00:00,000)

	var t = moment(0, "HH");

	var timeCode_Rgx = new RegExp(timeCode_RgxPattern, 'g');
	var timeCodesLine_Rgx = new RegExp(timeCodesLine_RgxPattern, 'g');
	var startTime, endTime;

	setContent(_porcessedContentId, '');

	var result = content.replace(timeCodesLine_Rgx, function (timeCodeLineMatch) {
		debugger;
		var result = timeCodeLineMatch.replace(timeCode_Rgx, function (timeCodeMatch) {
			debugger;
			return moment(timeCodeMatch, timeCode_Fromat).add(shiftDuration).format(timeCode_Fromat);
		});

		return result;
	});

	setContent(_porcessedContentId, result);
}
