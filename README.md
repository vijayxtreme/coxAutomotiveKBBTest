## INSTRUCTIONS

You don't need to npm install anything.  Everything just works in the browser, head on over to index.html and open it up.  It pulls from the file 'script.js'.  From there hit the "Start me up" button, and the program should connect over to KBB (so long as you have internet).  After a few seconds, you should see a message for the "Answer" in the "Answer" section.

## UNIT TESTING

I also did this app with unit testing.  View /test/app.test.js for the code.  I had to modify this code slightly because it's not running in a browser any longer, it's running with node.  Hence you'll need to make sure you run `npm install` so you get the packages for Jest, Jest-Extended and Node-Fetch.  After that, simply run `npm run test` from console and you should be able to run the tests.

## NOTES
- I could use the client API also provided and make the calls to the API that way, but fetch/Promise (native JS) seems to work just fine and may be optimal.  
- Main javascript file in script.js
- Unit tests are in the folder test under the file app.test.js
- I noticed that this client API ("dealers and vehicles") has some errors with NPM (hence that's why I didn't use it):
  - I had to change the "base" url for the API to the correct API url at:  http://api.coxauto-interview.com/ to get it working, the original baseUrl on NPM is different.
  - NPM throws an error for "version" property in package.json (not sure why, but I ran npm install on a fresh installation both on Windows and Linux and got an error).  Interestingly, taking the version property out fixes the issue, as well as using yarn.
  - The API Client ultimately is usable, but yeah I just felt like writing something in vanilla JS made more sense for this exercise given that the challenge is supposed to take 1-2 hours, and the goal is to get the response down to as little milliseconds as possible. The lighter the framework, the easier it is to work with and maintain.
- For fun, I used styling from Bulma.io for the browser version of this project.  It's a little lighter weight than Bootstrap, which I think the API uses currently.