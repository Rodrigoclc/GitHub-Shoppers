import { useState, useEffect } from 'react';
import { Table, Button, Tag, Avatar } from 'antd';
import { ArrowLeftOutlined, GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { purchasesApi, Purchase } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const History = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await purchasesApi.getAll();
      setPurchases(response.data.data.compras);
    } catch (error: any) {
      toast.error('Erro ao carregar histórico de compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Item',
      key: 'item',
      render: (_: any, record: Purchase) => record.itemname || 'N/A',
    },
    {
      title: 'Preço',
      key: 'preco',
      render: (_: any, record: Purchase) =>
        record.itemprice ? `R$ ${Number(record.itemprice).toFixed(2)}` : 'N/A',
    },
    {
      title: 'Comprador (GitHub)',
      dataIndex: 'comprador_github_login',
      key: 'comprador_github_login',
      render: (login: string) => (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            src={`https://github.com/${login}.png`}
            icon={<GithubOutlined />}
          />
          <a
            href={`https://github.com/${login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @{login}
          </a>
        </div>
      ),
    },
    {
      title: 'Data da Compra',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) =>
        format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="success">Concluída</Tag>,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Histórico de Compras
            </h1>
            <p className="text-muted-foreground">
              Visualize todas as transações realizadas
            </p>
          </div>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/catalog')}
            size="large"
          >
            Voltar ao Catálogo
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={purchases}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

export default History;
