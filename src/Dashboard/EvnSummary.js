import React from 'react';
import { Card } from 'antd';

export default class EvnSummary extends React.Component {
  render() {
    const title = (<span>云环境概览</span>);

    return (
      <Card title={title}>
        暂无云环境
      </Card>);
  }
}
