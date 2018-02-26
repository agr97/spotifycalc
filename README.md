# Playlist Calcify

Located here at [www.playlistcalcify.tk](www.playlistcalcify.tk)

A website used for calculating statistics for Spotify Playlists. 

Created using React, React Router, React Redux, Socket-io, Spotify-Web-Api-Node, Material-UI, and Postgresql. The site itself is deployed on DigitalOcean using nginx to serve the website itself.

The webpack scripts come from the use of create-react-app, so to Initialize, run

**npm run build**
in order to build the static files for the website. You must first create a .env file with your postgres database connection, as well as your spotify developer credentials. Note that the spotify developer secret is not compiled into the user facing website.

Then run
**node server**
In order to start the server. Then visit the port labeled in your environment variables to use the website.

![Playlist Calcify](https://i.imgur.com/SioptrX.png "Playlist Calcify")
