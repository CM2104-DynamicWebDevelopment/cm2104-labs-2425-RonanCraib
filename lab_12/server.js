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

// Function to search for tracks
async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
        .then(function (data) {
            res.send(JSON.stringify(data.body));
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
