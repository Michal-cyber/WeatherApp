const apiKey = "7fdaf6498c725875c13b0f457a5dde82";
let searchKey = "";
const today = new Date();
const date = getTime(today);

localTime = today.getTime()
localOffset = today.getTimezoneOffset() * 60000
utc = localTime + localOffset;

function getTime(day) {
	return day.getFullYear()+'/'+(day.getMonth()+1)+'/'+day.getDate();
}
function Celsius(data) {
	return Math.round((data -32)*5/9); 
};

$(document).ready(function() {

		const cloud = $('.cloud');

	let cloudText = $('#cloudText');
	cloud.hide();

	$("#submit").click(function() {
		let location = $("#location").val();
		//Zip code or city
		if (!isNaN(location)) {
			searchKey="zip"
		} else {
			searchKey="q"
		}
		//Get data from weather API
		if (location !="") {
			$.ajax({
				url: "http://api.openweathermap.org/data/2.5/weather?" + searchKey + '=' + location + '&units=imperial&appid=' + apiKey,
				dataType:"json",
				type: "GET",
				success: function(data) {
					const result = outputData(data);
					$('#outputData').html(result);
					$("outputData").val('');

					cloud.delay(500).fadeIn();	
					cloud.css('background-image', `url(http://openweathermap.org/img/w/${data.weather[0].icon}.png)`)
					cloud.css('background-repeat', 'no-repeat' );
					cloud.css('background-size', '260px' );
					cloud.css('background-position', '88px -52px' );

				cloudText.text(`${Celsius(data.main.temp)} °C`);
				
					//Drawing chart from weather API
					function chartData() {
						const chart = new CanvasJS.Chart("chartContainer", {
							animationEnabled: true,
							theme: "dark2",
							title:{
								text: "Temperature in " + data.name
							},
							axisY:{
								title: "Temperature",
								includeZero: false
							},
							axisX: {
						         title: "Time ?",
						        },
							data: [{
								type: "line",
								dataPoints: [
									{ y: Celsius(data.main.temp_max) , indexLabel: "THE HIGHEST", markerColor: "red", markerType: "triangle" , x: 0},
									{ y: Celsius(data.main.temp), indexLabel: "ACTUAL", x: 5 },
									{ y: Celsius(data.main.temp_min) , indexLabel: "THE LOWEST",markerColor: "White", markerType: "cross", x: 10 },
								]
							}],
							tooltip: {
								x: {
									format: 'dd MMM yyy'
								}
							}
						});
						chart.render();
					}
					//Calling chart and drawing
					chartData();
				}
			});
		} else {
			alert('Write the name of a city')
		}
	});

//Return with data to html
function outputData(data) {
	let currentTime = utc + (1000 * data.timezone);
		cityName = new Date(currentTime);
	return "<div class='outData'><h2>Weather in " + data.name + " | "  +
	" Current date: " + date + "</h2><br>" +
	" Current time: " + cityName + "<br> <br> <br>" +
	"<div class='weather'><img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' width= 100px class='img'>" +
	"<h4 class='dataD header'> Weather: " + data.weather[0].main + "<br>" +
	"Description: " + data.weather[0].description + "</div><br>" +
	"<div class='weather weather2'>Temperature: " + Celsius(data.main.temp) + "°C <br>" +
	"High Temp: " + Celsius(data.main.temp_max ) + " °C <br>" +
	"Low Temp: " + Celsius(data.main.temp_min) + " °C <br>" +
	"Pressure: " + data.main.pressure + " hPa</div> <br>" +
	"<div class='weather '>Humidity: " + data.main.humidity + " %<br>" +
	"Visibility: " + data.visibility/1000 + " km <br>" +
	"Wind Speed: " + data.wind.speed + " m/sec <br>" +
	"Wind direction: " + data.wind.deg + " degrees </h4></div></div><br>";
	
 }



})

