/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />

module Wodify {
	export class GetChartData {

		private resultPropertyName: string;

		public getData = (data: Models.IWodData): HighchartsSeriesChart => {
			this.resultPropertyName = this.getResultPropertyName(data.results_measure);

			if (!this.resultPropertyName) {
				throw "Could not determine the WOD measure!";
				return [];
			} else {
				var allResults: HighchartsSeriesChart[] = [<HighchartsSeriesChart>{
					name: "Male Athletes",
					data: this.getGenderResults(data.results.males, false),
					color: Models.ChartColors.maleRx,
					borderWidth: 0,
					pointPadding: .1,
					groupPadding: 0
				}, <HighchartsSeriesChart>{
					name: "Female Athletes",
					data: this.getGenderResults(data.results.females, true),
					color: Models.ChartColors.femaleRx,
					borderWidth: 0,
					pointPadding: .1,
					groupPadding: 0
				}];
				//console.info("ALL",allResults)
    
				return allResults;
			}
		}

		private getAthleteColor = (athlete: Models.IAthlete, isFemale: boolean): string => {
			if (athlete.rx) {
				return isFemale ? Models.ChartColors.femaleRx : Models.ChartColors.maleRx;
			} else if (athlete.rx_plus) {
				return isFemale ? Models.ChartColors.femaleRxPlus : Models.ChartColors.maleRxPlus;
			} else {
				return isFemale ? Models.ChartColors.female : Models.ChartColors.male;
			}
		}

		private getResultPropertyName = (resultType: Models.ResultTypes): string=> {
			let propName: string = null;
			if (resultType === Models.ResultTypes.time) {
				propName = "total_seconds";
			} else if (resultType === Models.ResultTypes.weight) {
				propName = "weight";
			} else if (resultType === Models.ResultTypes.reps) {
				propName = "reps";
			} else if (resultType === Models.ResultTypes.roundsAndReps) {
				//TODO: Figure out hwo this will work
				//result_property_name = "reps";
			}
			return propName;
		}

		private getGenderResults = (athletesArr: Models.IAthlete[], isFemale: boolean) => {
			var graphData:HighchartsSeriesChart[] = [];

			for (var i = 0; i < athletesArr.length; i++) {
				var athlete = athletesArr[i];
				var performace = athlete.performance_parts[this.resultPropertyName];

				if (!isFemale) {
					//reverse the data so the bars appear on the opposite side
					performace = performace * -1
				}

				graphData.push(<HighchartsSeriesChart>{
					name: athlete.name,
					y: performace,
					color: this.getAthleteColor(athlete, isFemale),
					athleteData: athlete,
					dataLabels: {
						enabled: athlete.pr,
						format: "PR!",
						inside: true
					}
				});
			}

			return graphData;
		}
	}
}