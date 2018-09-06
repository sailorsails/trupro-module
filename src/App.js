import React, { Component } from 'react';
import './App.css';
import Search from './Components/Search';
import Results from './Components/Results';
import EthHelper from './Components/EthHelper';

let ethHelper = new EthHelper();   

class App extends Component {
  constructor(){
    super();
    this.state = {
      startBlockVal: 0,
      endBlockVal: 0,
      results:{
        totalEther: 0,
        percentContract: 0,
        gasTotal: 0,
        gasAverage: 0,
        totalUncles: 0,
        blocks: [],
        transactions: [] 
      }
    } 
  }
  handleResult(result){
    console.log(result);
    // this.setState(ethHelper.getState());
    // console.log("APP STATE: ", this.state);
  }
  
  handleSearch(searchFirst, searchSecond){
    
    this.setState({startBlockVal: searchFirst, endBlockVal: searchSecond}, () =>{
      
      ethHelper.getBlocksAndTransactions(this.state.startBlockVal, this.state.endBlockVal, this.handleResult);
    });
  }
  
  render() {
    return (
      <div className="App">
        <h1>TruPro-Module</h1>        
        <Search search={this.handleSearch.bind(this)} />
        <Results results={this.state.results}/>
        
      </div>
    );
  }
}

export default App;

