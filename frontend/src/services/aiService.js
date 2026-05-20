const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function enviarMensagemIA(mensagem) {

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free",

                    messages: [
                        {
                            role: "system",
                            content:
                                "Você é a IA do WorkMatch. Ajude usuários a descrever serviços de forma objetiva.",
                        },
                        {
                            role: "user",
                            content: mensagem,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        console.log("RESPOSTA IA:", data);

        // ── tratamento seguro ──
        if (!response.ok) {

            console.error(data);

            return data?.error?.message ||
                "Erro ao conectar com IA.";
        }

        return (
            data?.choices?.[0]?.message?.content ||
            "A IA não conseguiu responder."
        );

    } catch (error) {

        console.error(error);

        return "Erro interno ao conectar com IA.";
    }
}