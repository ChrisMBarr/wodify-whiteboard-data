$(function(){
	$.getJSON("../sample-wod-fran.json", function(JSONdata){
		var graphData = formatData(JSONdata);
		makeChart(graphData);
	});	
});

function secondsToFormattedTime(totalSeconds){
	var minutes = Math.floor(totalSeconds / 60)
	var seconds = (totalSeconds - minutes * 60);
	if(seconds==0){
		seconds+="0";
	}else if(seconds < 10){
		seconds = "0"+seconds;
	}
	return minutes+ ":" + seconds;
}

function makeChart(graphData){
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container',
			type: 'bar',
		},
		title: {enabled:false},
		credits: {enabled:false},
		plotOptions: {
			series: {
				minPointLength: 1,
				stacking: 'normal',
				shadow: false,
				marker: {enabled: false}
			}
		},
		tooltip:{
			formatter:function(){
				//var d = this.point.athleteData;
				//TODO: add more details here about the performance
				return "<b>" + this.key + "</b><br/>"
				+ secondsToFormattedTime(Math.abs(this.y));
			}
		},
		xAxis: [{
			title: {enabled:false},
			lineColor: '#00FF00',
			tickColor: '#ccc',
			reversed:false,
			labels: {enabled:false}
		},{
			title: {enabled:false},
			lineColor: '#FF0000',
			tickColor: '#ccc',
			reversed:false,
			opposite:true,
			linkedTo:0,
			labels: {enabled:false},
		}],
		yAxis: {
			title: {enabled:false},
			labels:{
				formatter: function () {
					return secondsToFormattedTime(Math.abs(this.value));
				}
			},
			gridLineColor: '#e9e9e9',
			tickWidth: 1,
			tickLength: 3,
			tickColor: '#ccc',
			lineColor: '#ccc',
			endOnTick: false,
		},
		series: graphData
	});
}