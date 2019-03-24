import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props){
     super(props);
     this.state = {
        term: ''
    };

     this.handleSearch = this.handleSearch.bind(this);
     this.handleTermChange = this.handleTermChange.bind(this);
     this.handleKeyPress = this.handleKeyPress.bind(this);
     
    }

    handleTermChange(e) {
        this.setState({term: e.target.value});
        // console.log(this.state.term)
    }

    handleSearch(e) {
        this.props.onSearch(this.state.term);
        e.preventDefault();
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
          this.props.onSearch(this.state.term);
        }
      }


    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} placeholder="Enter A Song Title" />
                <a onClick={this.handleSearch}>SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;
