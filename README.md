# wodify-whiteboard-data
Extract the data from the whiteboard view of Wodify.com

##How To Use
1. Log in to Wodify
2. view the whiteboard page, and select the WOD component you want to get the data for
3. Copy/paste the JS in [`wodify-data-extract.js`](https://github.com/chrismbarr/wodify-whiteboard-data/blob/master/wodify-data-extract.js) in to the JS console
4. Profit!  Now you can view the `data` JSON object, or just view the JSON as a printed out string.

Eventually this will work better and you won't have to do these manual steps, but I'm just getting started with this right now!


##Data Format
Check out the sample files, but here's the basic breakdown.  

The overall details for the day and the selected WOD get parsed out like this:
```json
{
  "date": "Tuesday, September 22, 2015",
  "name": "6 Rounds (400m,RKBS,DU)",
  "comment": "",
  "components": [
    {
      "name": "Metcon (6 Rounds for time)",
      "description": "Fitness and Performance:Every 5 minutes, for 30 minutes (6 sets):- Run 400 Meters- 20 Russian Kettlebell Swings (heavy)- 40 Double-Unders *Compare to May, 13th"
    },
    {
      "name": "Skill Work",
      "description": "Fitness and Performance:Two sets of:- Hawaiian Squat* x 90 seconds each side- Seated Side Taps (Russian Twist) x 30 Seconds*https://www.youtube.com/watch?v=Ya7sdSAt1Hg"
    }
  ],
  "results_measure": "time",
  "results": {
    "males": [
	    {},{},{}
	  ],
	  "females": [
	    {},{},{}
	  ]
}
```

Note that the `results_measure` property which could be set to can be `"time"`, `"weight"`, `"reps"`, `"rounds + reps"`, or `"none"`

The  `results.males` and `results.females` will each contains arrays of athlete objects that each look something like this:

```json
{
  "name": "Chris Barr",
  "avatar": "https://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_175,q_80,w_1…5930000000/9s9gro_11796439_10100163210183116_1876396668901575280_n_jpg.jpg",
  "rank": 6,
  "class_info": "6:30 PM CrossFit",
  "performance_string": "20:13",
  "performance_parts": {
    "time_minutes": 20,
    "time_seconds": 13,
    "total_seconds": 1213
  },
  "performance_details": [
    "Round 1: 3:10",
    "Round 2: 3:10",
    "Round 3: 3:31",
    "Round 4: 3:15",
    "Round 5: 3:29",
    "Round 6: 3:38"
  ],
  "comment": "70# KB",
  "pr": false,
  "pr_details": "",
  "rx": true,
  "rx_plus": false,
  "social_likes": 0,
  "social_comments": 0
}
```

or like this (a WOD with a **time** based measure) *This is my new Fran time BTW, yay!*
```json
{
  "name": "Chris Barr",
  "avatar": "https://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_175,q_80,w_1…5930000000/9s9gro_11796439_10100163210183116_1876396668901575280_n_jpg.jpg",
  "rank": 9,
  "class_info": "4:30 PM CrossFit",
  "performance_string": "5:30",
  "performance_parts": {
    "time_minutes": 5,
    "time_seconds": 30,
    "total_seconds": 330
  },
  "performance_details": [],
  "comment": "",
  "pr": true,
  "pr_details": "PR by 2:09 vs. 7:39 on 12/26/2014",
  "rx": true,
  "rx_plus": false,
  "social_likes": 8,
  "social_comments": 1
}
```

or like this (a WOD with a **weight** based measure)
```json
{
  "name": "John Doe",
  "avatar": "https://app.wodify.com/W_Theme_UI/img/profile_male_175.png?5720",
  "rank": 1,
  "class_info": "4:30 PM CrossFit",
  "performance_string": "1 x 2 @ 295 lbs",
  "performance_parts": {
    "weight": 295,
    "units": "lbs",
    "rounds": 1,
    "reps": 2
  },
  "performance_details": [],
  "comment": "",
  "pr": false,
  "pr_details": "",
  "rx": false,
  "rx_plus": false,
  "social_likes": 0,
  "social_comments": 0
}
```

or like this (a WOD with a **reps** based measure)
```json
{
  "name": "Kirstin Barr",
  "avatar": "https://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_175,q_80,w_1…0/85272/635167782670000000/m5x2ux_1175130_797683863816_772894032_n_jpg.jpg",
  "rank": 1,
  "class_info": "4:30 PM CrossFit",
  "performance_string": "173 Total Reps",
  "performance_parts": {
    "reps": 173,
    "units": "Total Reps"
  },
  "performance_details": [
    "Round 1: 31 reps",
    "Round 2: 61 reps",
    "Round 3: 81 reps"
  ],
  "comment": "95# was a bad choice",
  "pr": false,
  "pr_details": "",
  "rx": false,
  "rx_plus": true,
  "social_likes": 3,
  "social_comments": 4
}
```


or like this (a WOD with a **rounds + reps** based measure)
```json
{
  "name": "Jane Doe",
  "avatar": "https://app.wodify.com/W_Theme_UI/img/profile_female_175.png?5720",
  "rank": 2,
  "class_info": "4:30 PM CrossFit",
  "performance_string": "20 + 13",
  "performance_parts": {
    "rounds": 20,
    "reps": 13,
    "units": ""
  },
  "performance_details": [],
  "comment": "",
  "pr": false,
  "pr_details": "",
  "rx": true,
  "rx_plus": false,
  "social_likes": 0,
  "social_comments": 0
}
```

Eventually I'll figure out something that can be done with this data now that it's in an easily consumable format - or maybe you can!