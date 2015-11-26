/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />

module Wodify {
	export class GetChartData {

		private primaryResultPropertyName: string;
		private secondaryResultPropertyName: string;

		public formatData = (data: Models.IWodData): HighchartsSeriesChart[] => {
			this.setResultPropertyNames(data.results_measure);

			if (!this.primaryResultPropertyName) {
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

		private setResultPropertyNames = (resultType: Models.ResultTypes): void=> {
			let propName: string = null;
			if (resultType === Models.ResultTypes.time) {
				this.primaryResultPropertyName = "total_seconds";
				this.secondaryResultPropertyName = null;
			} else if (resultType === Models.ResultTypes.weight) {
				this.primaryResultPropertyName = "weight";
				this.secondaryResultPropertyName = null;
			} else if (resultType === Models.ResultTypes.reps) {
				this.primaryResultPropertyName = "reps";
				this.secondaryResultPropertyName = null;
			} else if (resultType === Models.ResultTypes.roundsAndReps) {
				this.primaryResultPropertyName = "rounds";
				this.secondaryResultPropertyName = "reps";
			}
		}

		private getGenderResults = (athletesArr: Models.IAthlete[], isFemale: boolean) => {
			var graphData:HighchartsSeriesChart[] = [];

			for (var i = 0; i < athletesArr.length; i++) {
				var athlete = athletesArr[i];
				var performace = athlete.performance_parts[this.primaryResultPropertyName];

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