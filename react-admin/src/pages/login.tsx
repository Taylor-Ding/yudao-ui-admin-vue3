import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from 'umi';

const LoginPage: React.FC = () => {
  const intl = useIntl();
  const { login } = useModel('user');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    login();
    history.push('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title={intl.formatMessage({ id: 'nav.login' })} style={{ width: 400 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={intl.formatMessage({ id: 'login.username' })}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={intl.formatMessage({ id: 'login.password' })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block>
              {intl.formatMessage({ id: 'login.login' })}
            </Button>
            Or <a href="/register">{intl.formatMessage({ id: 'login.register' })}</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
