import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";
import PageLayout from "../components/PageLayout";
import {
    Btn,
    Card,
    CardBody,
    EmptyState
} from "../components/ui";

export default function CandidatosServico() {

    const { servicoId } = useParams();
    const navigate = useNavigate();

    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (servicoId) {
            carregar();
        }
    }, [servicoId]);

    async function carregar() {

        try {

            setLoading(true);
            setErro(null);

            const response = await api.get(
                `/api/candidaturas/servico/${servicoId}`

            );

            setCandidatos(response.data || []);

        } catch (error) {

            console.error(error);

            setErro(
                error?.response?.data?.message ||
                "Erro ao carregar candidatos."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <PageLayout
            title="Candidatos"
            subtitle="Profissionais interessados no serviço"
            backPath="/meus-servicos"
        >

            {loading && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px"
                    }}
                >
                    Carregando candidatos...
                </div>
            )}

            {!loading && erro && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "red"
                    }}
                >
                    <p>{erro}</p>

                    <Btn
                        variant="secondary"
                        onClick={carregar}
                    >
                        Tentar novamente
                    </Btn>
                </div>
            )}

            {!loading &&
                !erro &&
                candidatos.length === 0 && (

                    <EmptyState
                        emoji="👷"
                        title="Nenhum candidato"
                        description="Ainda não existem profissionais interessados neste serviço."
                    />

                )}

            {!loading &&
                !erro &&
                candidatos.length > 0 && (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        }}
                    >

                        {candidatos.map((candidato) => (

                            <Card key={candidato.id}>
                                <CardBody>

                                    <h3>
                                        👷 {candidato.nome}
                                    </h3>

                                    <p>
                                        🔧 {candidato.especialidade}
                                    </p>

                                    <p>
                                        📍 {candidato.cidade}/{candidato.estado}
                                    </p>

                                    <Btn
                                        variant="primary"
                                        onClick={() =>
                                            navigate(
                                                `/chat/${servicoId}?profissional=${candidato.profissionalId}`
                                            )
                                        }
                                    >
                                        💬 Abrir conversa
                                    </Btn>

                                </CardBody>
                            </Card>

                        ))}

                    </div>

                )}

        </PageLayout>
    );
}