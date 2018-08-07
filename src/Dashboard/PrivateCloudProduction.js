import React from 'react';
import { Card } from 'antd';

export default class PrivateCloudProduction extends React.Component {
  render() {
    const title = (<span>私有云投产情况</span>);

    return (
      <Card title={title}>
        暂无云环境
      </Card>);
  }
}
