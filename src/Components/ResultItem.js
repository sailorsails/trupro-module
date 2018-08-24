import React, { Component } from 'react';


class ResultItem extends Component {

  render() {
    return (
      <li>
        {this.props.result.address} {this.props.result.sendReceive} {this.props.result.totalEther} {this.props.result.isContract ? '✓' : null}
      </li>
    );
  }
}

export default ResultItem;