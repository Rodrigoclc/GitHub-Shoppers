import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { itemsApi, purchasesApi, Item } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Catalog = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await itemsApi.getAll();
      setItems(response.data.data.items);
    } catch (error: any) {
      toast.error('Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (values: { nome: string; preco: number; qtd_atual: number }) => {
    try {
      await itemsApi.create(values.nome, values.preco, values.qtd_atual);
      toast.success('Item adicionado com sucesso!');
      setIsModalOpen(false);
      form.resetFields();
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar item');
    }
  };

  const handlePurchase = async (itemId: number, itemName: string) => {
    try {
      await purchasesApi.create(itemId);
      toast.success(`Compra de "${itemName}" realizada com sucesso!`);
      fetchItems();
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Item fora de estoque!');
      } else {
        toast.error(error.response?.data?.message || 'Erro ao realizar compra');
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Preço',
      dataIndex: 'preco',
      key: 'preco',
      render: (preco: number) => `R$ ${Number(preco).toFixed(2)}`,
    },
    {
      title: 'Estoque',
      dataIndex: 'qtd_atual',
      key: 'qtd_atual',
      render: (qtd: number) => (
        <span className={qtd === 0 ? 'text-destructive font-semibold' : 'text-foreground'}>
          {qtd} {qtd === 1 ? 'unidade' : 'unidades'}
        </span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => handlePurchase(record.id, record.nome)}
          disabled={record.qtd_atual === 0}
          className="bg-accent hover:bg-accent/90"
        >
          Simular Compra
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Produtos</h1>
            <p className="text-muted-foreground">Olá, {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              onClick={() => navigate('/history')}
              size="large"
            >
              Histórico de Compras
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              size="large"
              className="bg-primary hover:bg-primary/90"
            >
              Adicionar Item
            </Button>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
              size="large"
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={items}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <Modal
          title="Adicionar Novo Item"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddItem}
            requiredMark={false}
          >
            <Form.Item
              name="nome"
              label="Nome do Produto"
              rules={[{ required: true, message: 'Por favor, insira o nome do produto!' }]}
            >
              <Input placeholder="Ex: Notebook Gamer" size="large" />
            </Form.Item>

            <Form.Item
              name="preco"
              label="Preço"
              rules={[{ required: true, message: 'Por favor, insira o preço!' }]}
            >
              <InputNumber
                prefix="R$"
                placeholder="0.00"
                size="large"
                style={{ width: '100%' }}
                min={0}
                step={0.01}
              />
            </Form.Item>

            <Form.Item
              name="qtd_atual"
              label="Quantidade em Estoque"
              rules={[{ required: true, message: 'Por favor, insira a quantidade!' }]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="bg-primary hover:bg-primary/90"
              >
                Adicionar Item
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Catalog;
