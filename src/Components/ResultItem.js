import React, { Component } from 'react';


class ResultItem extends Component {

  render() {
    return (
      <li>
        <div className='item'>
          <span>{this.props.result.address}</span>
          <span>{this.props.result.sendReceive}</span>
          <span>{this.props.result.totalEther}</span> 
          <span>{this.props.result.isContract ? '✓' : null}</span>
        </div>
      </li>
    );
  }
}

export default ResultItem;