/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
module.exports = function (app, path, bodyParser) {

  var Spotify = require('node-spotify-api');
  var spotifyKeys = {
    id: "33274dd92de5439da8bb2f0506caf104",
    secret: "f1d7f7ca635a47729169c4e47ef2dd9f"
  }

  var spotifyClient = new Spotify(spotifyKeys);


  app.get("/", function (req, res) {
<<<<<<< HEAD
   console.log(res);
    res.sendFile(path.join(__dirname, "/public/index.html"));
=======
   // console.log(res);
    res.sendFile(path.join(__dirname, "public/index.html"));
>>>>>>> upstream/master
    // spotifyClient.search({type: 'track', query: "u2"}, function (error, data) {
    //   if (error) console.log("Spotify error: " + error);
    //   console.log(data);

    //   res.json(data);
    // }

  });

  app.post("/spotify", function (req, res) {
    var artistSearch = req.body;
    console.log(artistSearch.queryTerm);
    spotifyClient.search({query: artistSearch.queryTerm, type: 'artist'}, function (error, data) {
<<<<<<< HEAD
=======
      if (error) console.log("Spotify error: " + error);
      // console.log(data); //searches for tracks instead of artists..?

      res.json(data);
    });
  });

  app.post("/artist", function (req, res) {
    var albumSearch = req.body;
    console.log(albumSearch.queryTerm);
    spotifyClient.search({query: albumSearch.queryTerm, type: 'album'}, function (error, data) {
>>>>>>> upstream/master
      if (error) console.log("Spotify error: " + error);
      // console.log(data); //searches for tracks instead of artists..?

      res.json(data);
    });
  });

<<<<<<< HEAD
 
=======
  app.post("/album", function (req, res) {
    var trackSearch = req.body;
    console.log(trackSearch.queryTerm);
    spotifyClient.search({query: trackSearch.queryTerm, type: 'track'}, function (error, data) {
      if (error) console.log("Spotify error: " + error);
      // console.log(data); //searches for tracks instead of artists..?

      res.json(data);
    });
  });


>>>>>>> upstream/master
  app.post("/test", function (req, res) {
    var clientData = req.body;
    console.log(clientData);
  });

    app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    // res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    // res.redirect('https://accounts.spotify.com/authorize?' +
    //   querystring.stringify({
    //     response_type: 'code',
    //     client_id: client_id,
    //     scope: scope,
    //     redirect_uri: redirect_uri,
    //     state: state
    //   }));
    // res.send('linked');
    res.sendFile(path.join(__dirname, "/public/default.html")); 
    //path to "home page" for the app
    //create a new html page for this, after logging in you should be directed to that page
  });


  var express = require('express'); // Express web server framework
  var request = require('request'); // "Request" library
  var querystring = require('querystring');
  var cookieParser = require('cookie-parser');

  var client_id = '6ab1c658f4184efaadcb8609d1194211'; // Your client id
  var client_secret = '2a4e44d459b1491bb236215a33026547'; // Your secret
  var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var stateKey = 'spotify_auth_state';

  var app = express();

  app.use(express.static(__dirname + '/public'))
     .use(cookieParser());



  app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
              refresh_token = body.refresh_token;

          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body , "here");
          });

          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

  app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });

  
} // end module.exports