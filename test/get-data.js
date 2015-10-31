var colors={
  female:"#F83ADD",
  femaleRx:"#E1407A",
  femaleRxPlus:"#EE5A38",
  male:"#2BACCB",
  maleRx:"#2F77B4",
  maleRxPlus:"#292BC1"
};

function getAthleteColor(isFemale, isRx, isRxPlus){
  if(isRx){
    return isFemale ? colors.femaleRx : colors.maleRx;
  }else if(isRxPlus){
    return isFemale ? colors.femaleRxPlus : colors.maleRxPlus;
  }else{
    return isFemale ? colors.female : colors.male;
  }  
}

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
      var isFemale = key.indexOf("Female") === 0;  
      var genderGroup = data.results[key];
      var graphData = [];
      
      //console.info(key, genderGroup);

      for (var i = 0; i < data.results[key].length; i++) {
        var athlete = genderGroup[i];
        var performace = athlete.performance_parts[result_property_name];
        
        if(!isFemale){
          //reverse the data so the bars appear on the opposite side
          performace = performace * -1
        }
        
        graphData.push({
          name: athlete.name,
          y: performace,
          color: getAthleteColor(isFemale, athlete.rx, athlete.rx_plus),
          athleteData: athlete
        });
      }
      
      allResults.push({
          name: key,
          data: graphData,
          color: isFemale ? colors.femaleRx : colors.maleRx,
          borderWidth: 0,
          pointPadding: .1,
          groupPadding: 0
      });
    });
  
    //console.info("ALL",allResults)
    
    return allResults;
  }
}