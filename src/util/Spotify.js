let accessToken;
let expiresIn;
const clientId = '75bf9b11873941ccaa54c581fa38d26b';
const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = 'http://localhost:3000/';

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {

      if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
        window.setTimeout(() => accessToken = '', expiresIn*1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {

        let url = `${authEndpoint}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = url;
      }
    }
  }, 
  search(searchTerm) {
    accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
          return response.json();
      }).then(jsonResponse => {
          if (jsonResponse.tracks.items) {
            return jsonResponse.tracks.items.map(track => ({
              id : track.id,
              name : track.name,
              artist : track.artists[0].name,
              album : track.album.name,
              uri : track.uri
            }));
          }
        })
  }, 
    
    
    
  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris) {

      return
    }
    accessToken = this.getAccessToken();
    let userId;
    let playlistId;
    try {



      let response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) {
        alert('There was a problem retrieving your user ID.');
        return;
      }
      let jsonResponse = await response.json();
      userId = jsonResponse.id;



      let nameResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName
        })
      });
      if (!nameResponse.ok) {
        alert('There was a problem posting the playlist name.');
        return;
      }
      jsonResponse = await nameResponse.json();
      playlistId = jsonResponse.id;



      let tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({uris: trackUris})
      });
      if (!tracksResponse.ok) {
        alert('There was a problem posting the playlist tracks.');
        return;
      }
    } 
      
    catch(error) {
      console.log(error);
      return;
    }
    return 'Done';
  } // end of savePlaylist
}; // end of Spotify method

export default Spotify;