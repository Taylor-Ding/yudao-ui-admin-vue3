import React from 'react';
import { Card } from 'antd';
import { useIntl } from 'umi';

const HomePage: React.FC = () => {
  const intl = useIntl();
  return (
    <Card>
      <h1>{intl.formatMessage({ id: 'welcome.title' })}</h1>
      <p>{intl.formatMessage({ id: 'welcome.message' })}</p>
    </Card>
  );
};

export default HomePage;
