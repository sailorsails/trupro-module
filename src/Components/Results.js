import React, { Component } from 'react';
import ResultItem from './ResultItem';


class Results extends Component {
  render() {
    let resultItems;
    if(this.props.results.records){
      resultItems = this.props.results.records.map(result => {
          return (
            <ResultItem key={result.address} result={result} />
          );
      });
    }
    return (
      <div className="Result">
        <h3>Results</h3>
        <ul>
            <li>Total Ether Sent: {this.props.results.totalEther}</li>
            <li>% Contract Transactions: {this.props.results.percentContract}</li>
            <li>Unique Sent Addresses: {this.props.results.uniqueSent}</li>
            <li>Unique Received Addresses: {this.props.results.uniqueReceived}</li>
            <li>Gas Average: {this.props.results.gasAverage}</li>
            
        </ul>
       
        <div className='Grid'>
            <ul className="Records">
                <li><strong>Address</strong> <strong>Sent/Received</strong> <strong>Total Ether</strong> <strong>Is Contract</strong></li> 
                {resultItems} 
            </ul>
            
            
        </div>
        
      </div>
    );
  }
}

export default Results;