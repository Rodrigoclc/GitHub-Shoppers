import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GithubOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/catalog');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { email: string; password: string; role: string }) => {
    setLoading(true);
    try {
      await register(values.email, values.password, values.role);
      navigate('/catalog');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GithubOutlined className="text-6xl text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">GitHub Shoppers</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <Tabs
            defaultActiveKey="login"
            centered
            items={[
              {
                key: 'login',
                label: 'Login',
                children: (
                  <Form
                    name="login"
                    onFinish={handleLogin}
                    layout="vertical"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Por favor, insira seu email!' },
                        { type: 'email', message: 'Email inválido!' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="seu@email.com"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Senha"
                      rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                        className="bg-primary hover:bg-primary/90"
                      >
                        Entrar
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'register',
                label: 'Cadastro',
                children: (
                  <Form
                    name="register"
                    onFinish={handleRegister}
                    layout="vertical"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Por favor, insira seu email!' },
                        { type: 'email', message: 'Email inválido!' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="seu@email.com"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Senha"
                      rules={[
                        { required: true, message: 'Por favor, insira sua senha!' },
                        { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirmar Senha"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Por favor, confirme sua senha!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('As senhas não coincidem!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label="Tipo de Conta"
                      rules={[{ required: true, message: 'Por favor, selecione o tipo de conta!' }]}
                      initialValue="user"
                    >
                      <Select size="large" placeholder="Selecione o tipo de conta">
                        <Select.Option value="admin">Administrador</Select.Option>
                        <Select.Option value="user">Usuário</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                        className="bg-primary hover:bg-primary/90"
                      >
                        Criar Conta
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Auth;
