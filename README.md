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
  "results": {
    "Male Athletes": [
	    //Array of athlete objetcs here - see below
	  ],
	  "Female Athletes": [
	    //Array of athlete objetcs here - see below
	  ]
}
```

And then each athlete object looks something like this:
```json
{
	"name": "Chris Barr",
	"avatar": "https://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_175,q_80,w_175,x_0,y_0/v1/1968/574050/635747575930000000/9s9gro_11796439_10100163210183116_1876396668901575280_n_jpg.jpg",
	"rank": 6,
	"class": "6:30 PM CrossFit",
	"performance": "20:13",
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

or like this: *(This is my new Fran time BTW, yay!)*
```json
{
    "name": "Chris Barr",
    "avatar": "https://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_175,q_80,w_175,x_0,y_0/v1/1968/574050/635747575930000000/9s9gro_11796439_10100163210183116_1876396668901575280_n_jpg.jpg",
    "rank": 9,
    "class": "4:30 PM CrossFit",
    "performance": "5:30",
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

Eventaully I'll figure out something that can be done with this data now that it's in an easily consumable format - or maybe you can!