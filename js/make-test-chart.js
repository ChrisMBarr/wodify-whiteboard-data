/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />
var Wodify;
(function (Wodify) {
    var Chart = (function () {
        function Chart() {
            var _this = this;
            this.chartAccentColor = "#aaaaaa";
            this.chartBackgroundColor = "#222";
            this.secondsToFormattedTime = function (totalSeconds) {
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = (totalSeconds - minutes * 60);
                var secondsStr = seconds.toString();
                if (seconds == 0) {
                    secondsStr += "0";
                }
                else if (seconds < 10) {
                    secondsStr = "0" + secondsStr;
                }
                return minutes.toString() + ":" + secondsStr;
            };
            this.makeChart = function (rawData, graphData, elementId) {
                return new Highcharts.Chart(_this.getChartOptions(rawData, graphData, elementId));
            };
            this.getChartOptions = function (rawData, graphData, elementId) {
                var chartThis = _this;
                function tooltipFormatterFn() {
                    //This must not be declared as an arrow function so that
                    //we can have access to `this` within the context of ths function
                    var d = this.point.athleteData;
                    var tt = "<b style='font-size: 16px;'>#" + d.rank + "</b><br/>";
                    //tt+="<img src='"+d.avatar+"' width='50' height='50'/>";
                    tt += "<b>" + d.name + "</b><br/>";
                    tt += "<small>" + d.class_info + "</small><br/>";
                    tt += "<b>" + d.performance_string + "</b>";
                    if (d.rx) {
                        tt += " <b>(Rx)</b>";
                    }
                    else if (d.rx_plus) {
                        tt += " <b>(Rx+)</b>";
                    }
                    if (d.pr) {
                        tt += "<hr/>" + d.pr_details;
                    }
                    return tt;
                }
                function xAxisFormatter() {
                    //This must not be declared as an arrow function so that
                    //we can have access to `this` within the context of ths function
                    if (rawData.results_measure === Wodify.Models.ResultTypes.time) {
                        return chartThis.secondsToFormattedTime(Math.abs(this.value));
                    }
                    else {
                        return Math.abs(this.value).toString();
                    }
                }
                return {
                    chart: {
                        renderTo: elementId,
                        type: "bar",
                        backgroundColor: _this.chartBackgroundColor
                    },
                    title: { text: null },
                    credits: { enabled: false },
                    series: graphData,
                    legend: {
                        enabled: false,
                        itemStyle: {
                            color: _this.chartAccentColor
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
                            lineColor: _this.chartAccentColor,
                            reversed: true,
                            opposite: false,
                            labels: {
                                style: {
                                    color: _this.chartAccentColor
                                }
                            }
                        }, {
                            title: { enabled: false },
                            lineColor: _this.chartAccentColor,
                            reversed: true,
                            opposite: true,
                            linkedTo: 0,
                            labels: {
                                style: {
                                    color: _this.chartAccentColor
                                }
                            }
                        }],
                    yAxis: {
                        labels: {
                            style: {
                                color: _this.chartAccentColor
                            },
                            formatter: xAxisFormatter
                        },
                        gridLineColor: _this.chartAccentColor,
                        tickWidth: 1,
                        tickLength: 3,
                        tickColor: _this.chartAccentColor,
                        lineColor: _this.chartAccentColor,
                        endOnTick: false
                    }
                };
            };
        }
        return Chart;
    })();
    Wodify.Chart = Chart;
})(Wodify || (Wodify = {}));
