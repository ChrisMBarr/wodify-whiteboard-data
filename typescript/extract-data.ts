/// <reference path="../typings/tsd.d.ts" />
/// <reference path="models.ts" />

module Wodify {
  
  export class Extractor {
    //Default data
    data: Models.IWodData = {
      date: null,
      name: null,
      comment: null,
      components: null,
      results_measure: Models.ResultTypes.none,
      results: {
        males: [],
        females: []
      }
    };

    public getData = () => {
      this.data.date = $("[id$='wtDateTitle']").text().trim();
      this.data.name = $(".wod_wrapper > .wod_header").text().trim();
      this.data.comment = $(".wod_wrapper > .wod_comment").text().trim();
      this.data.components = this.getWodComponents();
      this.data.results = this.getAllAthleteResults();
      console.log(JSON.stringify(this.data, null, 2));
    }

    private getWodComponents = (): Models.IWodComponents[] => {
      var components: Models.IWodComponents[] = [];
      //Loop over the components
      $(".wod_wrapper > .ListRecords > .component_show_wrapper").each((i: number, componentEl: Element) => {
        var $componentItems = $(componentEl).children();
        components.push({
          name: $componentItems.filter(".component_name").text().trim(),
          description: $componentItems.filter(".component_wrapper").text().trim()
        })
      });
      return components;
    }

    private getAthleteRank = ($result: JQuery): number => {
      //Parse the ranking to a real number
      return parseInt($result.children(".RankingBanner").text().trim(), 10)
    }

    private getAthleteName = ($resultDetailItems: JQuery): string => {
      //The name is split into two lines, replace line breaks with spaces
      return $resultDetailItems.eq(0).attr("title").replace("\n", " ");
    }

    private getAthleteAvatar = ($result: JQuery): string => {
      //Save the full image URL. If it's a relative URL, prefix it with the current page URL
      var imgUrl = $result.find("img").attr("src");
      if (imgUrl.indexOf("http") !== 0) {
        imgUrl = document.location.origin + imgUrl;
      }
      return imgUrl;
    }

    private getAthleteClass = ($resultDetailItems: JQuery): string => {
      return $resultDetailItems.filter(".DetailsClass").text().trim();
    }

    private getAthletePerformanceString = ($resultDetailItems: JQuery): string => {
      return $resultDetailItems.filter(".DetailsPerformance").text().trim();
    }

    private getAthletePerformanceDetails = ($resultDetailItems: JQuery): string[] => {
      //Details about the performance are stored on the title (like breakdowns for each round in an AMRAP, etc.)
      //Split info on new lines into array parts
      var details = $resultDetailItems.filter(".DetailsPerformance").children("span").attr("title").trim().split("\n");
  
      //If there is just one item and it's blank, reset this to an empty array
      if (details.length === 1 && details[0] === "") {
        details = [];
      }
      return details;
    }

    private setWodMeasure = (athleteNum: number, parsedTime: string[], parsedWeight: string[], parsedRepsOnly: string[], parsedRoundsAndReps: string[]): void => {
      //We only need to set the results measure type for the first athlete
      if (athleteNum === 0 && this.data.results_measure === Models.ResultTypes.none) {

        //console.info(ResultTypes.time, parsedTime);
        //console.info(ResultTypes.weight, parsedWeight);
        //console.info(ResultTypes.reps, parsedRepsOnly);
        //console.info(ResultTypes.roundsAndReps, parsedRoundsAndReps);

        if (parsedTime) {
          this.data.results_measure = Models.ResultTypes.time;
        } else if (parsedWeight) {
          this.data.results_measure = Models.ResultTypes.weight;
        } else if (parsedRepsOnly) {
          this.data.results_measure = Models.ResultTypes.reps;
        } else if (parsedRoundsAndReps) {
          this.data.results_measure = Models.ResultTypes.roundsAndReps;
        } else {
          this.data.results_measure = Models.ResultTypes.none;
        }
      }
    }

    private getAthletePerformanceParts =
    (athleteNum: number, parsedTime: string[], parsedWeight: string[], parsedRepsOnly: string[], parsedRoundsAndReps: string[]):
      Models.IWodPerfomancePartsTime | Models.IWodPerfomancePartsWeight | Models.IWodPerfomancePartsReps | Models.IWodPerfomancePartsRoundsAndReps => {

      //determine the measure type for the entire WOD
      this.setWodMeasure(athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps);
      
      //Now that we have the measure, we can try to parse the parts
      if (this.data.results_measure === Models.ResultTypes.time) {
        let min = parseInt(parsedTime[1], 10);
        let sec = parseInt(parsedTime[2], 10);
        return <Models.IWodPerfomancePartsTime>{
          "time_minutes": min,
          "time_seconds": sec,
          "total_seconds": sec + (min > 0 ? min * 60 : 0)
        };
      } else if (this.data.results_measure === Models.ResultTypes.weight) {
        let rounds = parseInt(parsedWeight[1], 10);
        let reps = parseInt(parsedWeight[2], 10);
        let weight = parseInt(parsedWeight[3], 10);
        let units = parsedWeight[4];
        let parts: Models.IWodPerfomancePartsWeight = {
          "weight": weight,
          "units": units,
        };

        if (!isNaN(rounds)) {
          parts.rounds = rounds;
        }
        if (!isNaN(reps)) {
          parts.reps = reps;
        }

        return parts;
      } else if (this.data.results_measure === Models.ResultTypes.reps) {
        let reps = parseInt(parsedRepsOnly[1], 10);
        let units = parsedRepsOnly[2] || "";
        return <Models.IWodPerfomancePartsReps>{
          reps: reps,
          units: units
        }
      } else if (this.data.results_measure === Models.ResultTypes.roundsAndReps) {
        let rounds = parseInt(parsedRoundsAndReps[1], 10);
        let reps = parseInt(parsedRoundsAndReps[2], 10);
        let units = parsedRoundsAndReps[3] || "";
        return <Models.IWodPerfomancePartsRoundsAndReps>{
          rounds: rounds,
          reps: reps,
          units: units
        };
      } else {
        //Something else!
        return null;
      }
    }

    private getAthleteBadges = ($resultDetails: JQuery): Models.IAthleteBadges => {
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
      }
    }

    private getAthleteSocialCounts = ($result: JQuery): Models.IAthleteSocial => {
      var $soc = $result.find(".AthleteCardSocialLinks a");
      //Parse out the number of likes from the text and convert it to a real number
      var likeCount = parseInt($soc.eq(0).text().trim().replace(/(un)?like\s.\s/i, ""));
  
      //Parse out the number of comments from the text and convert it to a real number
      var commentCount = parseInt($soc.eq(1).children("span").eq(1).text().trim());

      return {
        likesCount: likeCount,
        commentsCount: commentCount
      }
    }

    private getAthleteResult = (athleteNum: number, elementToParse: Element): Models.IAthlete => {
      //Select some elements that we will use in here
      var $thisResult: JQuery = $(elementToParse);
      var $details: JQuery = $thisResult.children(".DetailsBanner");
      var $detailItems: JQuery = $details.children();

      var pRank = this.getAthleteRank($thisResult);
      var pName = this.getAthleteName($detailItems);
      var pImg = this.getAthleteAvatar($thisResult);
      var pClass = this.getAthleteClass($detailItems);
      var pPerf = this.getAthletePerformanceString($detailItems);
      var pPerfDetails = this.getAthletePerformanceDetails($detailItems);
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
      var pPerfParts = this.getAthletePerformanceParts(athleteNum, parsedTime, parsedWeight, parsedRepsOnly, parsedRoundsAndReps);
      var badges = this.getAthleteBadges($details);
      var social = this.getAthleteSocialCounts($thisResult);

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
    }

    private getAllAthleteResults = (): Models.IWodResults => {
      var results: Models.IWodResults = {
        males: [],
        females: []
      };
  
      //Loop over the groups of male & female athletes
      $("[id$='WhiteboardWrapper'] > table >tbody >tr> td").each((i: number, groupEl: Element) => {
        var $thisGroup = $(groupEl);
        var title = $thisGroup.children(".header2").text().trim();
        var resultsData: Models.IAthlete[] = [];
        var $results = $thisGroup.find(".CardWrapper");
    
        //Within the male/female groups, loop over the results from each athlete
        $results.each((ii: number, resultEl: Element) => {
          //Add a new item to the array, one for each athlete
          resultsData.push(this.getAthleteResult(ii, resultEl));
        });

        if (title.toLowerCase().indexOf('female') !== -1) {
          results.females = resultsData;
        } else {
          results.males = resultsData;
        }
      });

      return results;
    }

  }
}