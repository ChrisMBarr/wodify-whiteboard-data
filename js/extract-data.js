/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />
var Wodify;
(function (Wodify) {
    var Extractor = (function () {
        function Extractor() {
            var _this = this;
            //Default data
            this.data = {
                date: null,
                name: null,
                comment: null,
                components: null,
                results_measure: Wodify.Models.ResultTypes.none,
                results: {
                    males: [],
                    females: []
                }
            };
            this.getData = function () {
                _this.data.date = $("[id$='wtDateTitle']").text().trim();
                _this.data.name = $(".wod_wrapper > .wod_header").text().trim();
                _this.data.comment = $(".wod_wrapper > .wod_comment").text().trim();
                _this.data.components = _this.getWodComponents();
                _this.data.results = _this.getAllAthleteResults();
                console.log(JSON.stringify(_this.data, null, 2));
            };
            this.getWodComponents = function () {
                var components = [];
                //Loop over the components
                $(".wod_wrapper > .ListRecords > .component_show_wrapper").each(function (i, componentEl) {
                    var $componentItems = $(componentEl).children();
                    components.push({
                        name: $componentItems.filter(".component_name").text().trim(),
                        description: $componentItems.filter(".component_wrapper").text().trim()
                    });
                });
                return components;
            };
            this.getAthleteRank = function ($result) {
                //Parse the ranking to a real number
                return parseInt($result.children(".RankingBanner").text().trim(), 10);
            };
            this.getAthleteName = function ($resultDetailItems) {
                //The name is split into two lines, replace line breaks with spaces
                return $resultDetailItems.eq(0).attr("title").replace("\n", " ");
            };
            this.getAthleteAvatar = function ($result) {
                //Save the full image URL. If it's a relative URL, prefix it with the current page URL
                var imgUrl = $result.find("img").attr("src");
                if (imgUrl.indexOf("http") !== 0) {
                    imgUrl = document.location.origin + imgUrl;
                }
                return imgUrl;
            };
            this.getAthleteClass = function ($resultDetailItems) {
                return $resultDetailItems.filter(".DetailsClass").text().trim();
            };
            this.getAthletePerformanceString = function ($resultDetailItems) {
                return $resultDetailItems.filter(".DetailsPerformance").text().trim();
            };
            this.getAthletePerformanceDetails = function ($resultDetailItems) {
                //Details about the performance are stored on the title (like breakdowns for each round in an AMRAP, etc.)
                //Split info on new lines into array parts
                var details = $resultDetailItems.filter(".DetailsPerformance").children("span").attr("title").trim().split("\n");
                //If there is just one item and it's blank, reset this to an empty array
                if (details.length === 1 && details[0] === "") {
                    details = [];
                }
                return details;
            };
            this.setWodMeasure = function (athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps) {
                //We only need to set the results measure type for the first athlete
                if (athleteNum === 0 && _this.data.results_measure === Wodify.Models.ResultTypes.none) {
                    //console.info(Models.ResultTypes.time, parsedTime);
                    //console.info(Models.ResultTypes.weight, parsedWeight);
                    //console.info(Models.ResultTypes.reps, parsedRepsOnly);
                    //console.info(Models.ResultTypes.roundsAndReps, parsedRoundsAndReps);
                    if (parsedTime) {
                        _this.data.results_measure = Wodify.Models.ResultTypes.time;
                    }
                    else if (parsedWeight) {
                        _this.data.results_measure = Wodify.Models.ResultTypes.weight;
                    }
                    else if (parsedRepsOnly) {
                        _this.data.results_measure = Wodify.Models.ResultTypes.reps;
                    }
                    else if (parsedRoundsAndReps) {
                        _this.data.results_measure = Wodify.Models.ResultTypes.roundsAndReps;
                    }
                    else {
                        _this.data.results_measure = Wodify.Models.ResultTypes.none;
                    }
                }
            };
            this.getAthletePerformanceParts = function (athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps) {
                //determine the measure type for the entire WOD
                _this.setWodMeasure(athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps);
                //Now that we have the measure, we can try to parse the parts
                if (_this.data.results_measure === Wodify.Models.ResultTypes.time) {
                    var min = parseInt(parsedTime[1], 10);
                    var sec = parseInt(parsedTime[2], 10);
                    return {
                        "time_minutes": min,
                        "time_seconds": sec,
                        "total_seconds": sec + (min > 0 ? min * 60 : 0)
                    };
                }
                else if (_this.data.results_measure === Wodify.Models.ResultTypes.weight) {
                    var rounds = parseInt(parsedWeight[1], 10);
                    var reps = parseInt(parsedWeight[2], 10);
                    var weight = parseInt(parsedWeight[3], 10);
                    var units = parsedWeight[4];
                    var parts = {
                        "weight": weight,
                        "units": units
                    };
                    if (!isNaN(rounds)) {
                        parts.rounds = rounds;
                    }
                    if (!isNaN(reps)) {
                        parts.reps = reps;
                    }
                    return parts;
                }
                else if (_this.data.results_measure === Wodify.Models.ResultTypes.reps) {
                    var reps = parseInt(parsedRepsOnly[1], 10);
                    var units = parsedRepsOnly[2] || "";
                    return {
                        reps: reps,
                        units: units
                    };
                }
                else if (_this.data.results_measure === Wodify.Models.ResultTypes.roundsAndReps) {
                    var rounds = parseInt(parsedRoundsAndReps[1], 10);
                    var reps = parseInt(parsedRoundsAndReps[2], 10);
                    var units = parsedRoundsAndReps[3] || "";
                    return {
                        rounds: rounds,
                        reps: reps,
                        units: units
                    };
                }
                else {
                    //Something else!
                    return null;
                }
            };
            this.getAthleteBadges = function ($resultDetails) {
                var $badges = $resultDetails.find(".BadgeWrapper");
                //If there are two badges, then it was a PR since the RX on/off badge is always there
                var isPR = $badges.length === 2;
                //If it was a PR, details about the PR are stored on the image title
                var prDetails = isPR ? $badges.first().children("img").attr("title").trim() : "";
                //If it was a PR, then the RX badge is the 2nd one, otherwise it's the first badge
                var $rxBadge = $badges.eq(isPR ? 1 : 0).children().first();
                //Depending on the class applied to this badge, we can determine if it was RX or not, or RX+
                var isRX = $rxBadge.hasClass("RxOnNoClick");
                var isRxPlus = $rxBadge.hasClass("RxPlusOnNoClick");
                return {
                    isPr: isPR,
                    prDetails: prDetails,
                    isRx: isRX,
                    isRxPlus: isRxPlus
                };
            };
            this.getAthleteSocialCounts = function ($result) {
                var $soc = $result.find(".AthleteCardSocialLinks a");
                //Parse out the number of likes from the text and convert it to a real number
                var likeCount = parseInt($soc.eq(0).text().trim().replace(/(un)?like\s.\s/i, ""));
                //Parse out the number of comments from the text and convert it to a real number
                var commentCount = parseInt($soc.eq(1).children("span").eq(1).text().trim());
                return {
                    likesCount: likeCount,
                    commentsCount: commentCount
                };
            };
            this.getAthleteResult = function (athleteNum, elementToParse) {
                //Select some elements that we will use in here
                var $thisResult = $(elementToParse);
                var $details = $thisResult.children(".DetailsBanner");
                var $detailItems = $details.children();
                var pRank = _this.getAthleteRank($thisResult);
                var pName = _this.getAthleteName($detailItems);
                var pImg = _this.getAthleteAvatar($thisResult);
                var pClass = _this.getAthleteClass($detailItems);
                var pPerf = _this.getAthletePerformanceString($detailItems);
                var pPerfDetails = _this.getAthletePerformanceDetails($detailItems);
                var pPerfComment = ($detailItems.filter(".DetailsComment").children("span").first().attr("title") || "").trim();
                //Run some regex's against the performance string
                //Finds strings like `21:43`
                var parsedTime = pPerf.match(/^(\d+):(\d+)$/);
                //Finds strings like `1 X 5 @ 155 lbs` or `70 lbs` or `20 kgs`
                var parsedWeight = pPerf.match(/^(?:(\d+)\sX\s(\d+) @ )?(\d+)\s(lbs?|kgs?)$/i);
                //finds strings like `32` or `145 total reps` or `95 calories`
                var parsedRepsOnly = pPerf.match(/^(\d+)\s?([a-z\s]+)?$/i);
                //finds strings like `18 + 6 rounds` or `4 + 0`
                var parsedRoundsAndReps = pPerf.match(/^(\d+)\s\+\s(\d+)?\s?([a-z\s]+)?$/i);
                //Now back to the athlete, parse the performance parts
                var pPerfParts = _this.getAthletePerformanceParts(athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps);
                var badges = _this.getAthleteBadges($details);
                var social = _this.getAthleteSocialCounts($thisResult);
                return {
                    name: pName,
                    avatar: pImg,
                    rank: pRank,
                    class_info: pClass,
                    performance_string: pPerf,
                    performance_parts: pPerfParts,
                    performance_details: pPerfDetails,
                    comment: pPerfComment,
                    pr: badges.isPr,
                    pr_details: badges.prDetails,
                    rx: badges.isRx,
                    rx_plus: badges.isRxPlus,
                    social_likes: social.likesCount,
                    social_comments: social.commentsCount
                };
            };
            this.getAllAthleteResults = function () {
                var results = {
                    males: [],
                    females: []
                };
                //Loop over the groups of male & female athletes
                $("[id$='WhiteboardWrapper'] > table >tbody >tr> td").each(function (i, groupEl) {
                    var $thisGroup = $(groupEl);
                    var title = $thisGroup.children(".header2").text().trim();
                    var resultsData = [];
                    var $results = $thisGroup.find(".CardWrapper");
                    //Within the male/female groups, loop over the results from each athlete
                    $results.each(function (ii, resultEl) {
                        //Add a new item to the array, one for each athlete
                        resultsData.push(_this.getAthleteResult(ii, resultEl));
                    });
                    if (title.toLowerCase().indexOf('female') !== -1) {
                        results.females = resultsData;
                    }
                    else {
                        results.males = resultsData;
                    }
                });
                return results;
            };
        }
        return Extractor;
    })();
    Wodify.Extractor = Extractor;
})(Wodify || (Wodify = {}));
