function formatData(data){
  
  var result_property_name;
  if(data.results_measure === "time"){
    result_property_name = "total_seconds";
  }else if(data.results_measure === "weight"){
    result_property_name = "weight";
  }else if(data.results_measure === "reps"){
    result_property_name = "reps";
    //TODO: make this work with rounds + reps
    //stacked bar chart?
  }
  
  if(!result_property_name){
    throw "Could not determine the WOD measure!";
  }else{
    var allResults = [];
    Object.keys(data.results).forEach(function(key){
      var shouldReverse = key.indexOf("Female") === -1;  
      var genderGroup = data.results[key];
      var graphData = [];
      
      console.info(key, genderGroup);

      for (var i = 0; i < data.results[key].length; i++) {
        var athlete = genderGroup[i];
        var performace = athlete.performance_parts[result_property_name];
        
        if(shouldReverse){
          //reverse the data so the bars appear on the opposite side
          performace = performace * -1
        }
        graphData.push({
          name: athlete.name,
          y: performace,
          athleteData: athlete
        });
      }
      
      allResults.push({
          name: key,
          data: graphData,
          borderWidth: .5,
          pointPadding: .1,
          groupPadding: 0
      });
    });
  
    console.info("ALL",allResults)
    
    return allResults;
  }
}