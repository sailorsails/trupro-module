import React, { Component } from 'react';
import './App.css';
import Search from './Components/Search';
import Results from './Components/Results';
import EthHelper from './Components/EthHelper';

var ethHelper;

class App extends Component {
  constructor(){
    super();
    this.state = {
      startBlockVal: 0,
      endBlockVal: 0,
      results:{
        totalEther: 0,
        percentContract: 0,
        uniqueSent: 0,
        uniqueReceived: 0,
        gasAverage: 0,
        records: []
      }
    }
    ethHelper = new EthHelper();
    // ethHelper.getCurrentBlockNumber(() => {
    //   console.log('Callback from current block number');
    //   ethHelper.getBlockRange(this.state.startBlockVal, this.state.endBlockVal, () =>{
    //     console.log('Callback from get block range');
    //     ethHelper.getBlocks();
    //   });
    // });
    // ethHelper.getBlocks(this.state.startBlockVal, this.state.endBlockVal);
    // .then(() => {
    //   ethHelper.getBlockRange().then(() => {
    //     ethHelper.getBlocks(this.state);
    //   });
    // });
     
  }
  componentWillMount(){
    // this.setState(
    //   {
    //     results: {
    //       totalEther: 100,
    //       percentContract: 10,
    //       uniqueSent: 3,
    //       uniqueReceived: 2,
    //       gasAverage: 100020102,
    //       records: [
    //         {
    //           address: '0x00000000',
    //           totalEther: 10,
    //           sendReceive: 'send',
    //           isContract: false    
    //         },
    //         {
    //           address: '0x11111111',
    //           totalEther: 77,
    //           sendReceive: 'send',
    //           isContract: false    
    //         },
    //         {
    //           address: '0x22222222',
    //           totalEther: 100,
    //           sendReceive: 'receive',
    //           isContract: true    
    //         },
    //         {
    //           address: '0x33333333',
    //           totalEther: 204,
    //           sendReceive: 'send',
    //           isContract: false    
    //         },
    //       ]
    //   }
    // });
  }
  handleSearch(searchFirst, searchSecond){
    
    this.setState({startBlockVal: searchFirst, endBlockVal: searchSecond}, () =>{
      ethHelper.getCurrentBlockNumber(() => {
          ethHelper.getBlockRange(this.state.startBlockVal, this.state.endBlockVal, () =>{
            ethHelper.getBlocks();
          });
      });
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

