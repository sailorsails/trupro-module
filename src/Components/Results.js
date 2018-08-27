import React, { Component } from 'react';
import ResultItem from './ResultItem';


class Results extends Component {
  render() {
    let resultItems;
    if(this.props.results.blocks){
      resultItems = this.props.results.blocks.map(result => {
          return (
            <ResultItem key={result.address} result={result} />
          );
      });
    }
    return (
      <div className="Result">
        <h3>Results</h3>
        <ul>
            <li>Total Ether Transferred: {this.props.results.totalEther}</li>
            <li>% Contract Transactions: {this.props.results.percentContract}</li>
            <li>Unique Sent Addresses: {this.props.results.uniqueSent}</li>
            <li>Unique Received Addresses: {this.props.results.uniqueReceived}</li>
            <li>Gas Total: {this.props.results.gasTotal}</li>
            <li>Gas Average: {this.props.results.gasAverage}</li>
            <li>Total Uncles: {this.props.results.totalUncles}</li>
            
        </ul>
       
        <div className='Grid'>
            <ul className="Records">
                <li>
                  <div>
                    <span><strong>Address</strong></span>
                    {/* <span><strong>Sent/Received</strong></span> */}
                    <span><strong>Total Ether</strong></span>
                    <span><strong>Is Contract</strong></span>
                  </div>
                </li> 
                {resultItems} 
            </ul>
            
            
        </div>
        
      </div>
    );
  }
}

export default Results;