Had to make a few modifications for this to work.

- First url to API endpoint was wrong, changed in node_modules/dealers_and_vehicles/API
- Next, the npm version throws an error when trying to npm install, so I took it out and then npm installed, works fine now
- Also the callback example code console.logs a string instead of a JS object so it was a bit confusing, but I realized data is a JS Object by itself; so I used that function instead.