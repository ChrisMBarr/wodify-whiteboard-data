/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />

module Wodify {
	export class Chart {

		private chartAccentColor = "#aaaaaa";
		private chartBackgroundColor = "#222";

		private secondsToFormattedTime = (totalSeconds: number): string=> {
			var minutes: number = Math.floor(totalSeconds / 60)
			var seconds: number = (totalSeconds - minutes * 60);
			var secondsStr: string = seconds.toString();
			if (seconds == 0) {
				secondsStr += "0";
			} else if (seconds < 10) {
				secondsStr = "0" + secondsStr;
			}
			return minutes.toString() + ":" + secondsStr;
		}

		public makeChart = (rawData: Models.IWodData, graphData: HighchartsSeriesChart[], elementId: string): HighchartsChartObject => {
			return new Highcharts.Chart(this.getChartOptions(rawData, graphData, elementId));
		}

		private getChartOptions = (rawData: Models.IWodData, graphData: HighchartsSeriesChart[], elementId: string): HighchartsOptions=> {
			let chartThis = this;

			function tooltipFormatterFn(): string {
				//This must not be declared as an arrow function so that
				//we can have access to `this` within the context of ths function
				let d: Models.IAthlete = this.point.athleteData;
				let tt = "<b style='font-size: 16px;'>#" + d.rank + "</b><br/>"; 
				//tt+="<img src='"+d.avatar+"' width='50' height='50'/>";
				tt += "<b>" + d.name + "</b><br/>";
				tt += "<small>" + d.class_info + "</small><br/>";
				
				tt += "<b>" + d.performance_string + "</b>";

				// if (rawData.results_measure === Models.ResultTypes.time) {
				// 	tt += "<b>" + chartThis.secondsToFormattedTime(Math.abs(this.y)) + "</b>";
				// } else {
				// 	//These three interfaces al have the `units` property on them
				// 	let parts: Models.IWodPerfomancePartsReps | Models.IWodPerfomancePartsRoundsAndReps | Models.IWodPerfomancePartsWeight
				// 	 = <Models.IWodPerfomancePartsReps | Models.IWodPerfomancePartsRoundsAndReps | Models.IWodPerfomancePartsWeight>
				// 	 d.performance_parts;
				// 	let suffix = " " + parts.units;
				// 	tt += "<b>" + Math.abs(this.y) + suffix + "</b>";
				// }
				if (d.rx) {
					tt += " <b>(Rx)</b>";
				} else if (d.rx_plus) {
					tt += " <b>(Rx+)</b>";
				}

				if (d.pr) {
					tt += "<hr/>" + d.pr_details;
				}

				return tt;
			}

			function xAxisFormatter(): string {
				//This must not be declared as an arrow function so that
				//we can have access to `this` within the context of ths function
				if (rawData.results_measure === Models.ResultTypes.time) {
					return chartThis.secondsToFormattedTime(Math.abs(this.value));
				} else {
					return Math.abs(this.value).toString();
				}
			}

			return {
				chart: {
					renderTo: elementId,
					type: "bar",
					backgroundColor: this.chartBackgroundColor
				},
				title: { text: null },
				credits: { enabled: false },
				series: graphData,
				legend: {
					enabled: false,
					itemStyle: {
						color: this.chartAccentColor
					}
				},
				plotOptions: {
					series: {
						//minPointLength: 1,
						stacking: 'normal',
						shadow: false,
						marker: { enabled: false }
					}
				},
				tooltip: {
					useHTML: true,
					formatter: tooltipFormatterFn
				},
				xAxis: [{
					title: { enabled: false },
					lineColor: this.chartAccentColor,
					reversed: true,
					opposite: false,
					labels: {
						style: {
							color: this.chartAccentColor
						}
					}
				}, {
						title: { enabled: false },
						lineColor: this.chartAccentColor,
						reversed: true,
						opposite: true,
						linkedTo: 0,
						labels: {
							style: {
								color: this.chartAccentColor
							}
						}
					}],
				yAxis: {
					labels: {
						style: {
							color: this.chartAccentColor
						},
						formatter: xAxisFormatter
					},
					gridLineColor: this.chartAccentColor,
					tickWidth: 1,
					tickLength: 3,
					tickColor: this.chartAccentColor,
					lineColor: this.chartAccentColor,
					endOnTick: false,
				},
			}
		}
	}
}