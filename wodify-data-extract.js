//for now, just run this in the JS console... will be improved upon later!

var data = {
  "date": $("[id$='wtDateTitle']").text().trim(),
  "name": $(".wod_wrapper > .wod_header").text().trim(),
  "comment": $(".wod_wrapper > .wod_comment").text().trim(),
  "components":[],
  "results":{}
};

//Loop over the components
$(".wod_wrapper > .ListRecords > .component_show_wrapper").each(function(i, componentEl){
  var $componentItems = $(componentEl).children();
  data.components.push({
    "name":$componentItems.filter(".component_name").text().trim(),
    "description":$componentItems.filter(".component_wrapper").text().trim()
  })
})

//Loop over the groups of male & female athletes
$("[id$='WhiteboardWrapper'] > table >tbody >tr> td").each(function(i, groupEl){
  var $thisGroup = $(groupEl);
  var title = $thisGroup.children(".header2").text().trim();
  var resultsData = [];
  var $results = $thisGroup.find(".CardWrapper");
  
  //WIthin the male/female groups, loop over the results from each athlete
  $results.each(function(i, resultEl){
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
    
    //If it was a PR, details abotu the PR are stored on the image title
    var pPrDetails = pIsPR ? $badges.first().children("img").attr("title").trim() : "";
    
    //If it was a PR, then the RX bandge is the 2nd one, otherwise it's the first badge
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
      "performance": pPerf,
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