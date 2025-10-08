import { Button } from 'antd';
import { GithubOutlined, ShoppingCartOutlined, BarChartOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/catalog');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <GithubOutlined className="text-8xl text-primary mb-6 animate-pulse" />
            <h1 className="text-6xl font-bold text-foreground mb-6">
              GitHub Shoppers
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plataforma completa para gerenciamento de catálogo de produtos com integração GitHub
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 h-12 px-8 text-lg"
              >
                Começar Agora
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/auth')}
                className="h-12 px-8 text-lg"
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">
          Recursos Principais
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors">
            <ShoppingCartOutlined className="text-5xl text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Gestão de Catálogo
            </h3>
            <p className="text-muted-foreground">
              Adicione, gerencie e controle o estoque de produtos de forma simples e eficiente.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 hover:border-accent transition-colors">
            <BarChartOutlined className="text-5xl text-accent mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Histórico Completo
            </h3>
            <p className="text-muted-foreground">
              Visualize todas as transações realizadas com integração de usuários do GitHub.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors">
            <SafetyOutlined className="text-5xl text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Seguro e Confiável
            </h3>
            <p className="text-muted-foreground">
              Autenticação JWT e controle de estoque em tempo real para máxima segurança.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Crie sua conta gratuitamente e comece a gerenciar seu catálogo hoje mesmo.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90 h-12 px-12 text-lg"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
