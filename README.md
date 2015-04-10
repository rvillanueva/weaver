#weaver
A Watson Challenge Application
by Ryan Villanueva (rjvillan@us.ibm.com)
--------------------------

See the live demo at http://weaver.mybluemix.net.

Weaver takes massive amounts of text and reveals relationships between people, places, times, and events.

Weaver uses several APIs and components to process large amounts of text. An example process flow:

1. Use Yahoo BOSS API to search news articles from Canada in French.
2. Retrieve HTML from each of the listed pages.
3. Extract text using the 'unfluff' node package.
4. Translate text using Watson Machine Translation.
5. Use Watson Relationship Extraction to pull a relationship graph from the text of the documents.
6. Use a modified chrono node package to extract time data and TimelineJS to graph it.
7. Geocode the geopolitical entities identified by Watson Relationship Extraction using the Google Geocoding API, then map on Google Maps.
8. Use d3js to generate a relationship graph.

Weaver is built using AngularJS, ExpressJS, and Node.js.

See the bower.json and package.json files for a full list of dependencies.

Watson Services:
-Relationship Extraction
-Machine Translation

Running
--------------------------

To run a local instance, navigate to the root folder and use the 'grunt serve' command from the command line.

To compile a distribution version, use 'grunt build'
