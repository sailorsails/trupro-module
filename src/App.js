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
        uniqueSent: 0,
        uniqueReceived: 0,
        gasAverage: 0,
        totalUncles: 0,
        blocks: [],
        transactions: []
      }
    }
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
    //       blocks: [
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
      
      ethHelper.getBlocksAndTransactions(this.state.startBlockVal, this.state.endBlockVal);
      // ethHelper.getCurrentBlockNumber(() => {
      //     ethHelper.getBlockRange(this.state.startBlockVal, this.state.endBlockVal, () =>{
      //       ethHelper.getBlocks(() =>{              
      //         this.setState({results: {blocks: [ethHelper.getState()]}}, () =>{
      //           if(this.state.results.blocks){
      //             console.log('MAIN blocks for trans: ', this.state.results.blocks);
      //             ethHelper.getTransactions();
      //           }
      //         });
              
      //       });
      //     });
      // });
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

