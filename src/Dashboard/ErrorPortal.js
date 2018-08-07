import React from 'react';
import {Card} from 'antd';

class ErrorPortal extends React.Component {
  render() {
    const {name} = this.props;
    return (
      <Card title={name}>
        ERROR
      </Card>
    );
  }
}

export default ErrorPortal;
