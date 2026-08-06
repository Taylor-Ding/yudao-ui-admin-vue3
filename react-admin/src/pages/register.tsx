import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history, useIntl } from 'umi';

const RegisterPage: React.FC = () => {
  const intl = useIntl();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // Simulate a registration and redirect to the login page
    history.push('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title={intl.formatMessage({ id: 'nav.register' })} style={{ width: 400 }}>
        <Form
          name="normal_register"
          className="register-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={intl.formatMessage({ id: 'register.username' })}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={intl.formatMessage({ id: 'register.password' })}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={intl.formatMessage({ id: 'register.confirmPassword' })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button" block>
              {intl.formatMessage({ id: 'register.register' })}
            </Button>
            Already have an account? <a href="/login">{intl.formatMessage({ id: 'register.login' })}</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
