var express = require('express');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');

// Initialize the Spotify API client
var spotifyApi = new SpotifyWebApi({
    clientId: '956d46665d564cfea27c2c6e3c0c68fd',
    clientSecret: 'c090eac3c8fc471ca386f2e615077c64'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token for future API calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
        console.log('Something went wrong when retrieving an access token', err.message);
    }
);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to search for tracks and return HTML response
async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
        .then(function (data) {
            var tracks = data.body.tracks.items;
            var HTMLResponse = "<h1>Search Results for '" + searchterm + "'</h1>";

            // Iterate over the tracks and build the HTML response
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                HTMLResponse += `
                    <div style="margin-bottom: 20px;">
                        <h2>${track.name}</h2>
                        <h4>${track.artists[0].name}</h4>
                        <img src="${track.album.images[0].url}" style="max-width: 200px;">
                        <br>
                        <a href="${track.external_urls.spotify}" target="_blank">Track Details</a>
                    </div>
                `;
            }

            res.send(HTMLResponse);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send('Error fetching tracks');
        });
}

// Route for the homepage
app.get('/', function (req, res) {
    res.send("Hello world! by express");
});

// Route to search for "love" in tracks, artists, and albums
app.get('/searchLove', function (req, res) {
    getTracks('love', res);
});

// Start the server
app.listen(8080, function () {
    console.log('Server is running on http://localhost:8080');
});
