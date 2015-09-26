//for now, just run this in the JS console... will be improved upon later!

var data = {
  "date": $("[id$='wtDateTitle']").text().trim(),
  "name": $(".wod_wrapper > .wod_header").text().trim(),
  "comment": $(".wod_wrapper > .wod_comment").text().trim(),
  "components":[],
  "results_measure": "none", //this will get replaced later, after we have athlete results to parse
  "results":{}
};

//Loop over the components
$(".wod_wrapper > .ListRecords > .component_show_wrapper").each(function(i, componentEl){
  var $componentItems = $(componentEl).children();
  data.components.push({
    "name":$componentItems.filter(".component_name").text().trim(),
    "description":$componentItems.filter(".component_wrapper").text().trim()
  })
});

//Loop over the groups of male & female athletes
$("[id$='WhiteboardWrapper'] > table >tbody >tr> td").each(function(i, groupEl){
  var $thisGroup = $(groupEl);
  var title = $thisGroup.children(".header2").text().trim();
  var resultsData = [];
  var $results = $thisGroup.find(".CardWrapper");
  
  //WIthin the male/female groups, loop over the results from each athlete
  $results.each(function(ii, resultEl){
    //Select some elements that we will use in here
    var $thisResult = $(resultEl);
    var $details = $thisResult.children(".DetailsBanner");
    var $detailItems = $details.children();
    var $soc = $thisResult.find(".AthleteCardSocialLinks a");
    var $badges = $details.find(".BadgeWrapper");
        
    //The athlete data we are looking for
    
    //Parse the ranking to a real number
    var pRank = parseInt($thisResult.children(".RankingBanner").text().trim(), 10);
    
    //The name is split into two lines, replace line breaks with spaces
    var pName = $detailItems.eq(0).attr("title").replace("\n", " ");
    
    //Save the full image URL. If it's a relative URL, prefix it with the current page URL
    var pImg = $thisResult.find("img").attr("src");
    if(pImg.indexOf("http") !== 0){
      pImg = document.location.origin + pImg;
    }
    
    var pClass = $detailItems.filter(".DetailsClass").text().trim();
    var pPerf = $detailItems.filter(".DetailsPerformance").text().trim();
    var pPerfParts = {};

    var parsedTime = pPerf.match(/(\d+):(\d+)/);
    var parsedWeight = pPerf.match(/(?:(\d+)\sX\s(\d+) @ )?(\d+)\s(lbs?|kgs?)/i);
    var parsedReps = pPerf.match(/(\d+)(?:\s\+\s(\d+))?\s?([a-z\s]+)?/i);

    //We only need to set the results measure type for the first athlete
    if(ii === 0 && data.results_measure === "none"){
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

    if(parsedTime){
      data.results_measure = "time";
      var min = parseInt(parsedTime[1], 10);
      var sec = parseInt(parsedTime[2], 10);
      pPerfParts = {
        "time_minutes": min,
        "time_seconds": sec,
        "total_seconds": sec + (min > 0 ? min*60 : 0)
      };
    }else if(parsedWeight){
      data.results_measure = "weight";
      var rounds = parseInt(parsedWeight[1], 10);
      var reps = parseInt(parsedWeight[2], 10);
      var weight = parseInt(parsedWeight[3], 10);
      var units = parsedWeight[4];
      pPerfParts = {
        "weight": weight,
        "units": units,
      };

      if(!isNaN(rounds)){
        pPerfParts["rounds"] = rounds;
      }
      if(!isNaN(reps)){
        pPerfParts["reps"] = reps;
      }

    }else if(parsedReps){
      data.results_measure = "reps";
      var rounds = parseInt(parsedReps[1], 10);
      var reps = parseInt(parsedReps[2], 10);
      var units = parsedReps[3];
      if(!isNaN(rounds) && !isNaN(reps)){
        pPerfParts["rounds"] = rounds;
        pPerfParts["reps"] = reps;
      }else if(!isNaN(rounds) && isNaN(reps)){
        pPerfParts["reps"] = rounds;
      }

      if(units){
        pPerfParts["units"] = units;
      }
    }
    
    //Details about the performance are stored on the title (like breakdowns for each round in an AMRAP, etc.)
    //Split info on new lines into array parts
    var pPerfDetails = $detailItems.filter(".DetailsPerformance").children("span").attr("title").trim().split("\n");
    
    //If there is just one item and it's blank, reset this to an empty array
    if(pPerfDetails.length===1 && pPerfDetails[0]===""){
      pPerfDetails = [];
    }
    
    var pPerfComment = $detailItems.filter(".DetailsComment").text().trim();
    
    //If there are two badges, then it was a PR since the RX on/off badge is always there
    var pIsPR = $badges.length === 2;
    
    //If it was a PR, details about the PR are stored on the image title
    var pPrDetails = pIsPR ? $badges.first().children("img").attr("title").trim() : "";
    
    //If it was a PR, then the RX badge is the 2nd one, otherwise it's the first badge
    var $rxBadge = $badges.eq(pIsPR ? 1 : 0).children().first();
    
    //Depending on the class applied to this badge, we can determine if it was RX or not, or RX+
    var pIsRX = $rxBadge.hasClass("RxOnNoClick");
    var pIsRxPlus = $rxBadge.hasClass("RxPlusOnNoClick");
    
    //Parse out the number of likes from the text and convert it to a real number
    var pLikeCount = parseInt($soc.eq(0).text().trim().replace(/(un)?like\s.\s/i,""));
    
    //Parse out the number of comments from the text and convert it to a real number
    var pCommentCount = parseInt($soc.eq(1).children("span").eq(1).text().trim());
    
    //Add a new item to the array, one for each athlete
    resultsData.push({
  		"name": pName,
      "avatar":pImg,
      "rank":pRank,
      "class": pClass,
      "performance_string": pPerf,
      "performance_parts": pPerfParts,
      "performance_details":pPerfDetails,
      "comment": pPerfComment,
      "pr": pIsPR,
      "pr_details": pPrDetails,
      "rx": pIsRX,
      "rx_plus": pIsRxPlus,
      "social_likes": pLikeCount,
      "social_comments": pCommentCount
    });
  });
  
  //Add all of the results for each athlete gender group
  data.results[title]=resultsData;
});

console.log(JSON.stringify(data,null, 2));