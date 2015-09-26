/* global $ */

//for now, just run this in the JS console... will be improved upon later!

function getWodComponents(){
  var components = [];
  //Loop over the components
  $(".wod_wrapper > .ListRecords > .component_show_wrapper").each(function(i, componentEl){
    var $componentItems = $(componentEl).children();
    components.push({
      "name":$componentItems.filter(".component_name").text().trim(),
      "description":$componentItems.filter(".component_wrapper").text().trim()
    })
  });
  return components;
}

function getAthleteRank($result){
  //Parse the ranking to a real number
  return parseInt($result.children(".RankingBanner").text().trim(), 10)
}
function getAthleteName($resultDetailItems){
  //The name is split into two lines, replace line breaks with spaces
  return $resultDetailItems.eq(0).attr("title").replace("\n", " ");
}
function getAthleteAvatar($result){
  //Save the full image URL. If it's a relative URL, prefix it with the current page URL
  var imgUrl = $result.find("img").attr("src");
  if(imgUrl.indexOf("http") !== 0){
    imgUrl = document.location.origin + imgUrl;
  }
  return imgUrl;
}
function getAthleteClass($resultDetailItems){
  return $resultDetailItems.filter(".DetailsClass").text().trim();
}
function getAthletePerformanceString($resultDetailItems){
  return $resultDetailItems.filter(".DetailsPerformance").text().trim();
}
function getAthletePerformanceDetails($resultDetailItems){
  //Details about the performance are stored on the title (like breakdowns for each round in an AMRAP, etc.)
  //Split info on new lines into array parts
  var details = $resultDetailItems.filter(".DetailsPerformance").children("span").attr("title").trim().split("\n");
  
  //If there is just one item and it's blank, reset this to an empty array
  if(details.length===1 && details[0]===""){
    details = [];
  }
  return details;
}
function setWodMeasure(athleteNum, parsedTime, parsedWeight, parsedReps){
  //We only need to set the results measure type for the first athlete
  if(athleteNum === 0 && data.results_measure === "none"){
    if(parsedTime){
      data.results_measure = "time";
    }else if(parsedWeight){
      data.results_measure = "weight";
    }else if(parsedReps){
      data.results_measure = "reps";
    }else{
      data.results_measure = "none";
    }
  }
}
function getAthletePerformanceParts(parsedTime, parsedWeight, parsedReps){
  var parts = {};
  if(parsedTime){
      data.results_measure = "time";
      var min = parseInt(parsedTime[1], 10);
      var sec = parseInt(parsedTime[2], 10);
      parts = {
        "time_minutes": min,
        "time_seconds": sec,
        "total_seconds": sec + (min > 0 ? min * 60 : 0)
      };
    }else if(parsedWeight){
      data.results_measure = "weight";
      var wRounds = parseInt(parsedWeight[1], 10);
      var wReps = parseInt(parsedWeight[2], 10);
      var wWeight = parseInt(parsedWeight[3], 10);
      var wUnits = parsedWeight[4];
      parts = {
        "weight": wWeight,
        "units": wUnits,
      };

      if(!isNaN(wRounds)){
        parts["rounds"] = wRounds;
      }
      if(!isNaN(wReps)){
        parts["reps"] = wReps;
      }

    }else if(parsedReps){
      data.results_measure = "reps";
      var rRounds = parseInt(parsedReps[1], 10);
      var rReps = parseInt(parsedReps[2], 10);
      var rUnits = parsedReps[3];
      if(!isNaN(rRounds) && !isNaN(rReps)){
        parts["rounds"] = rRounds;
        parts["reps"] = rReps;
      }else if(!isNaN(rRounds) && isNaN(rReps)){
        parts["reps"] = rRounds;
      }

      if(rUnits){
        parts["units"] = rUnits;
      }
    }
    return parts;
}
function getAthleteBadges($resultDetails){
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
    "isPr": isPR,
    "prDetails":prDetails, 
    "isRx": isRX,
    "isRxPlus": isRxPlus
  }
}
function getAthleteSocialCounts($result){
  var $soc = $result.find(".AthleteCardSocialLinks a");
  //Parse out the number of likes from the text and convert it to a real number
  var likeCount = parseInt($soc.eq(0).text().trim().replace(/(un)?like\s.\s/i,""));
  
  //Parse out the number of comments from the text and convert it to a real number
  var commentCount = parseInt($soc.eq(1).children("span").eq(1).text().trim());
  
  return{
    "likes": likeCount,
    "comments": commentCount
  }
}

function getAthleteResult(athleteNum, elementToParse){
  //Select some elements that we will use in here
  var $thisResult = $(elementToParse);
  var $details = $thisResult.children(".DetailsBanner");
  var $detailItems = $details.children();
  
  var pRank = getAthleteRank($thisResult);
  var pName = getAthleteName($detailItems);
  var pImg = getAthleteAvatar($thisResult);
  var pClass = getAthleteClass($detailItems);
  var pPerf = getAthletePerformanceString($detailItems);
  var pPerfDetails = getAthletePerformanceDetails($detailItems);
  var pPerfComment = $detailItems.filter(".DetailsComment").text().trim();
  
  //Run some regex's against the performance string
  var parsedTime = pPerf.match(/(\d+):(\d+)/);
  var parsedWeight = pPerf.match(/(?:(\d+)\sX\s(\d+) @ )?(\d+)\s(lbs?|kgs?)/i);
  var parsedReps = pPerf.match(/(\d+)(?:\s\+\s(\d+))?\s?([a-z\s]+)?/i);
  
  //determine the measure type for the entire WOD
  setWodMeasure(athleteNum, parsedTime, parsedWeight, parsedReps);
  
  //Now back to the athlete, parse the performance parts
  var pPerfParts = getAthletePerformanceParts(parsedTime, parsedWeight, parsedReps);
  var badges = getAthleteBadges($details);
  var social = getAthleteSocialCounts($thisResult);
  
  return {
    "name": pName,
    "avatar":pImg,
    "rank":pRank,
    "class": pClass,
    "performance_string": pPerf,
    "performance_parts": pPerfParts,
    "performance_details":pPerfDetails,
    "comment": pPerfComment,
    "pr": badges.isPr,
    "pr_details": badges.prDetails,
    "rx": badges.isRx,
    "rx_plus": badges.isRxPlus,
    "social_likes": social.likes,
    "social_comments": social.comments
  };
}

function getAllAthleteResults(){
  var results = {};
  
  //Loop over the groups of male & female athletes
  $("[id$='WhiteboardWrapper'] > table >tbody >tr> td").each(function(i, groupEl){
    var $thisGroup = $(groupEl);
    var title = $thisGroup.children(".header2").text().trim();
    var resultsData = [];
    var $results = $thisGroup.find(".CardWrapper");
    
    //WIthin the male/female groups, loop over the results from each athlete
    $results.each(function(ii, resultEl){
      //Add a new item to the array, one for each athlete
      resultsData.push(getAthleteResult(ii, resultEl));
    });
    
    //Add all of the results for each athlete gender group
    results[title]=resultsData;
  });
  
  return results;
}

var data = {
  "date": $("[id$='wtDateTitle']").text().trim(),
  "name": $(".wod_wrapper > .wod_header").text().trim(),
  "comment": $(".wod_wrapper > .wod_comment").text().trim(),
  "components": getWodComponents(),
  "results_measure": "none", //this will get replaced later, after we have athlete results to parse
  "results": {}
};
data.results = getAllAthleteResults();

console.log(JSON.stringify(data,null, 2));