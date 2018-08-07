import React from 'react';
import { Card } from 'antd';

export default class PrivateCloudResourceStatistics extends React.Component {
  render() {
    const title = (<span>私有云资源统计</span>);

    return (
      <Card title={title}>
        暂无云环境
      </Card>);
  }
}
