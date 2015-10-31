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
			backgroundColor: "#222"
		},
		title: {text:null},
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
			useHTML:true,
			formatter:function(){
				var d = this.point.athleteData;
				var tt = "<b style='font-size: 16px;'>#"+d.rank+"</b><br/>"; 
				//tt+="<img src='"+d.avatar+"' width='50' height='50'/>";
				tt+= "<b>" + d.name + "</b><br/>";
				tt+= "<small>"+d.class + "</small><br/>";
				tt += "<b>"+secondsToFormattedTime(Math.abs(this.y))+"</b>";
				
				if(d.rx){
					tt+=" <b>(Rx)</b>";
				}else if(d.rx_plus){
					tt+=" <b>(Rx+)</b>";
				}
				
				if(d.pr){
					tt+="<hr/>" + d.pr_details;
				}
				
				return tt;
			}
		},
		legend:{
			enabled:false,
			itemStyle:{
				color: "#aaaaaa"
			}
		},
		xAxis: [{
			title: {enabled:false},
			lineColor: '#aaaaaa',
			reversed:true,
			opposite:false,
			labels: {
				style:{
					color: "#aaaaaa"
				}
			}
		},{
			title: {enabled:false},
			lineColor: '#aaaaaa',
			reversed:true,
			opposite:true,
			linkedTo:0,
			labels: {
				style:{
					color: "#aaaaaa"
				}
			}
		}],
		yAxis: {
			title: {enabled:false},
			labels:{
				style:{
					color: "#aaaaaa"
				},
				formatter: function () {
					return secondsToFormattedTime(Math.abs(this.value));
				}
			},
			gridLineColor: '#aaaaaa',
			tickWidth: 1,
			tickLength: 3,
			tickColor: '#aaaaaa',
			lineColor: '#aaaaaa',
			endOnTick: false,
		},
		series: graphData
	});
}