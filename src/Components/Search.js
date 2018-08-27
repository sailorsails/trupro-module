import React, {Component} from 'react';

class Search extends Component {

    constructor() {
        super();
        this.state = {
            searchTermFirst: '',
            searchTermSecond: '',
            searchType: 'Single',
            isSubmitEnabled: false
        }
    }

    static defaultProps = {
        searchTypes: [
            'Single', 'Range'
        ]
    }

    // Handle the onChange event of the search type dropdown
    handleSearchTypeChange(e) {

        this.setState({
            searchType: e.target.value
        }, () => {
            this.setState({
                searchTermFirst: '',
                searchTermSecond: ''
            }, () => {
                this.handleSubmitEnabled();
            });
        });

    }

    // Handle the click event of the submit button
    handleSubmit(e) {
        this.props.search(this.state.searchTermFirst, this.state.searchTermSecond);
        e.preventDefault();
    }

    // Update the state of the search terms
    handleSearchTermChange(e) {
        if (e.target.name === 'searchTermFirst') {
            this.setState({
                searchTermFirst: e.target.value
            }, () => {
                this.handleSubmitEnabled();
            });
        } else if (e.target.name === 'searchTermSecond') {
            this.setState({
                searchTermSecond: e.target.value
            }, () => {
                this.handleSubmitEnabled();
            });
        }
    }

    // Check the state of the submit button based on input
    handleSubmitEnabled() {
        if (this.state.searchType === 'Single') {
            this.state.searchTermFirst === '' ? this.setState({
                isSubmitEnabled: false
            }) : this.setState({
                isSubmitEnabled: true
            });

        } else if (this.state.searchType === 'Range') {
            this.state.searchTermFirst === '' || this.state.searchTermSecond === '' ? this.setState({
                isSubmitEnabled: false
            }) : this.setState({
                isSubmitEnabled: true
            });
            console.log('Enabled: ', this.state.searchEntered);

        }
    }
    render() {
            let searchOptions = this.props.searchTypes.map(searchType => {
                return <option key = {searchType} value = {searchType} > {searchType} </option>
            });
            return ( 
                    <div className = "Search" >
                        <div className = 'SearchType' >
                            <h3 > Search Type </h3> 
                            <div className = "SearchTypeDropdown" >
                                <select ref = "searchType" onChange = {this.handleSearchTypeChange.bind(this)} > {searchOptions} </select> 
                        </div> 
                        {this.state.searchType === 'Range' ? < label > Query a range using a starting and an ending block number. </label> : <label>Query a number of blocks backwards from the latest block.</label >} 
                        </div> 
                        {this.state.searchType === 'Range' ? < label > Block Start </label> : <label>Number of blocks</label >}
                        <input name = 'searchTermFirst' type = 'number' ref = "searchTermFirst" value = {this.state.searchTermFirst} min='1' step='1' onChange = {this.handleSearchTermChange.bind(this)}/> 
                        {this.state.searchType === 'Range' ? < label > Block End </label> : null} 
                        {this.state.searchType === 'Range' ? < input name = 'searchTermSecond' type = 'number' ref = 'searchTermSecond' min={this.state.searchTermFirst} step='1' value = {this.state.searchTermSecond} onChange = {this.handleSearchTermChange.bind(this)}/> : null} 
                        <button id = 'btnSearchGo' disabled = {!this.state.isSubmitEnabled} onClick = {this.handleSubmit.bind(this)} > Search </button> 
                    </div>
                    );
                }
            }
            
export default Search;