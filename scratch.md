First get a datasetid (no-op) *or can generate one*
Start a timer to answer (get wrong answer for milliseconds).
keep that in a variable (for start time).

Make a variable called dealers which is of type array.

Make a call to /api/{dataset}/vehicles
-> returns a list of vehicles ~ 4 seconds
Have list of vehicles with id

Promise.all // to do multiple calls

Foreach
Make a call to /api/{dataset}/vehicles/{id} 
-> returns dataset for each vehicle, along with dealerId
~ 4 seconds


Make a call to /api/{dataset}/dealers/{dealerId}
-> get the dealer info
~ 4 seconds


12 seconds so far.  Post to /answer ~ 4 seconds

Time is 16 seconds.

Hence my build should be fast.

Max 30 seconds


Build up a response object
{
 "dealers": [
	{
	   "dealerId": "...",
        "name":"...",
        "vehicles":[{},{},{}]  
	},
	{
	   "dealerId": "...",
        "name":"...",
        "vehicles":[{},{},{}]  
	}
 ]
}

Send the object to /answer
Get new milliseconds time
Subtract old from new, get total milliseconds passed then convert to seconds.

Optimizations:
