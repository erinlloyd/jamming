//Erin Lloyd's project

import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistName: '',
      playlistTracks: [],
      success: false
    };
    
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
    
  addTrack(track) {
    if(this.state.playlistTracks.find(currentTrack => currentTrack.id === track.id)) {
      return; 
    } else {
      let tempPlaylist = this.state.playlistTracks.slice(); 
      tempPlaylist.push(track); 
      this.setState({playlistTracks: tempPlaylist}); 
    }
  }

  removeTrack(track) {
    let currentPlaylist = this.state.playlistTracks.filter(trackToRemove => trackToRemove.id !== track.id); 
    this.setState({playlistTracks: currentPlaylist}); 
  }

 
  updatePlaylistName(name){
    this.setState({playlistName: name}); 
  }

  
  savePlaylist() {
   
    let trackURIs = [];
    for (let i = 0; i < this.state.playlistTracks.length; i++){
      trackURIs.push(this.state.playlistTracks[i].uri);
    };

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist'});
    this.setState({success: true});
    
  }

  
  search(term){
    console.log(`Searching with ${term}`);
    Spotify.search(term).then(track =>{
      this.setState({searchResults: track})
    });
  }

 

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
        
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;