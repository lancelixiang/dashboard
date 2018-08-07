import React, {Component} from 'react';

export default class Normal extends Component {
  render() {
    const {span, height, module} = this.props;
    return (
      <div style={{height}} className={`ant-col-sm-24 ant-col-lg-${span}`}>
        {module}
      </div>);
  }
}
