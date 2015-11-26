/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />
var Wodify;
(function (Wodify) {
    var GetChartData = (function () {
        function GetChartData() {
            var _this = this;
            this.formatData = function (data) {
                _this.setResultPropertyNames(data.results_measure);
                if (!_this.primaryResultPropertyName) {
                    throw "Could not determine the WOD measure!";
                    return [];
                }
                else {
                    var allResults = [{
                            name: "Male Athletes",
                            data: _this.getGenderResults(data.results.males, false),
                            color: Wodify.Models.ChartColors.maleRx,
                            borderWidth: 0,
                            pointPadding: .1,
                            groupPadding: 0
                        }, {
                            name: "Female Athletes",
                            data: _this.getGenderResults(data.results.females, true),
                            color: Wodify.Models.ChartColors.femaleRx,
                            borderWidth: 0,
                            pointPadding: .1,
                            groupPadding: 0
                        }];
                    //console.info("ALL",allResults)
                    return allResults;
                }
            };
            this.getAthleteColor = function (athlete, isFemale) {
                if (athlete.rx) {
                    return isFemale ? Wodify.Models.ChartColors.femaleRx : Wodify.Models.ChartColors.maleRx;
                }
                else if (athlete.rx_plus) {
                    return isFemale ? Wodify.Models.ChartColors.femaleRxPlus : Wodify.Models.ChartColors.maleRxPlus;
                }
                else {
                    return isFemale ? Wodify.Models.ChartColors.female : Wodify.Models.ChartColors.male;
                }
            };
            this.setResultPropertyNames = function (resultType) {
                var propName = null;
                if (resultType === Wodify.Models.ResultTypes.time) {
                    _this.primaryResultPropertyName = "total_seconds";
                    _this.secondaryResultPropertyName = null;
                }
                else if (resultType === Wodify.Models.ResultTypes.weight) {
                    _this.primaryResultPropertyName = "weight";
                    _this.secondaryResultPropertyName = null;
                }
                else if (resultType === Wodify.Models.ResultTypes.reps) {
                    _this.primaryResultPropertyName = "reps";
                    _this.secondaryResultPropertyName = null;
                }
                else if (resultType === Wodify.Models.ResultTypes.roundsAndReps) {
                    _this.primaryResultPropertyName = "rounds";
                    _this.secondaryResultPropertyName = "reps";
                }
            };
            this.getGenderResults = function (athletesArr, isFemale) {
                var graphData = [];
                for (var i = 0; i < athletesArr.length; i++) {
                    var athlete = athletesArr[i];
                    var performace = athlete.performance_parts[_this.primaryResultPropertyName];
                    if (!isFemale) {
                        //reverse the data so the bars appear on the opposite side
                        performace = performace * -1;
                    }
                    graphData.push({
                        name: athlete.name,
                        y: performace,
                        color: _this.getAthleteColor(athlete, isFemale),
                        athleteData: athlete,
                        dataLabels: {
                            enabled: athlete.pr,
                            format: "PR!",
                            inside: true
                        }
                    });
                }
                return graphData;
            };
        }
        return GetChartData;
    })();
    Wodify.GetChartData = GetChartData;
})(Wodify || (Wodify = {}));
