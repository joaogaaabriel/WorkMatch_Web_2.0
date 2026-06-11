import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Input, Btn } from "../components/ui";
import { useToast } from "../hooks/useToast";

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

export default function ConfiguracaoPerfilPage() {
  const { user, setUser } = useAuth();
  const { showToast, Toast } = useToast();

  const [form, setForm] = useState({
    nome:     "",
    email:    "",
    telefone: "",
    endereco: "",
    cidade:   "",
    estado:   "",
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando,   setSalvando]   = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    api.get(`/api/usuarios/${user.id}`)
      .then(({ data }) => {
        setForm({
          nome:     data.nome     ?? "",
          email:    data.email    ?? "",
          telefone: data.telefone ?? "",
          endereco: data.endereco ?? "",
          cidade:   data.cidade   ?? "",
          estado:   data.estado   ?? "",
        });
      })
      .catch(() => showToast("Não foi possível carregar o perfil.", "erro"))
      .finally(() => setCarregando(false));
  }, [user?.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);

    try {
      const { data } = await api.put(`/api/usuarios/${user.id}`, form);
      if (data?.usuario?.nome) {
        setUser(prev => ({ ...prev, nome: data.usuario.nome }));
      }
      showToast("Perfil atualizado com sucesso.", "sucesso");
    } catch (err) {
      const msg = err.response?.data?.message ?? "Erro ao salvar. Tente novamente.";
      showToast(msg, "erro");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <PageLayout title="Meu Perfil">
        <div className="wm-empty-state">Carregando perfil...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Meu Perfil" subtitle="Atualize suas informações pessoais">
      <Toast />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="wm-form-grid">
            <Input
              label="Nome completo"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <Input
              label="Telefone"
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              autoComplete="tel"
            />
            <Input
              label="Endereço"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro"
              autoComplete="street-address"
            />
            <Input
              label="Cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              autoComplete="address-level2"
            />

            <div className="wm-form-group">
              <label className="wm-label">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="wm-input"
              >
                <option value="">Selecione</option>
                {ESTADOS_BR.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="wm-form-actions">
            <Btn type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Btn>
          </div>
        </Card>
      </form>
    </PageLayout>
  );
}
