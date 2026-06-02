import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/PageLayout";
import { Card, CardBody, Btn, Spinner, EmptyState } from "../components/ui";

const API_URL = import.meta.env.VITE_API_URL;

export default function CandidatosServico() {

    const { servicoId } = useParams();

    const navigate = useNavigate();

    const [candidatos, setCandidatos] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {

        try {

            const response = await fetch(
                `${API_URL}/api/candidaturas/servico/${servicoId}`
            );

            const data = await response.json();

            setCandidatos(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    return (
        <PageLayout
            title="Candidatos"
            subtitle="Profissionais interessados"
            backPath="/meus-servicos"
        >

            {loading && <Spinner />}

            {!loading && candidatos.length === 0 && (
                <EmptyState
                    emoji="👷"
                    title="Nenhum candidato"
                    description="Ainda não existem profissionais interessados."
                />
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--sp-4)"
                }}
            >
                {candidatos.map(candidato => (

                    <Card key={candidato.id}>

                        <CardBody>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "var(--sp-3)"
                                }}
                            >

                                <div>

                                    <h3
                                        style={{
                                            color: "var(--clr-navy)",
                                            marginBottom: 6
                                        }}
                                    >
                                        {candidato.profissionalNome}
                                    </h3>

                                    <p
                                        style={{
                                            color: "var(--clr-text-mid)",
                                            fontSize: 14
                                        }}
                                    >
                                        {candidato.especialidade}
                                    </p>

                                </div>

                                <Btn
                                    variant="primary"
                                    onClick={() =>
                                        navigate(
                                            `/chat/${servicoId}/${candidato.profissionalId}`
                                        )
                                    }
                                >
                                    💬 Abrir conversa
                                </Btn>

                            </div>

                        </CardBody>

                    </Card>

                ))}
            </div>

        </PageLayout>
    );
}