var Wodify;
(function (Wodify) {
    var Models;
    (function (Models) {
        var ResultTypes = (function () {
            function ResultTypes() {
            }
            ResultTypes.none = "none";
            ResultTypes.reps = "reps";
            ResultTypes.roundsAndReps = "rounds + reps";
            ResultTypes.time = "time";
            ResultTypes.weight = "weight";
            return ResultTypes;
        })();
        Models.ResultTypes = ResultTypes;
        var ChartColors = (function () {
            function ChartColors() {
            }
            ChartColors.female = "#F83ADD";
            ChartColors.femaleRx = "#E1407A";
            ChartColors.femaleRxPlus = "#EE5A38";
            ChartColors.male = "#2BACCB";
            ChartColors.maleRx = "#2F77B4";
            ChartColors.maleRxPlus = "#292BC1";
            return ChartColors;
        })();
        Models.ChartColors = ChartColors;
    })(Models = Wodify.Models || (Wodify.Models = {}));
})(Wodify || (Wodify = {}));
