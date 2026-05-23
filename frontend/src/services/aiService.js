const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Você é a assistente do WorkMatch. Seu objetivo é coletar informações para publicar um serviço.

Você precisa coletar obrigatoriamente:
1. Tipo de serviço / especialidade (ex: Pintor, Eletricista, Encanador)
2. Descrição do serviço (o que precisa ser feito)
3. Cidade e estado

Conduza a conversa de forma natural em português. Quando tiver coletado TODOS os dados obrigatórios, responda com um JSON no seguinte formato EXATO (sem mais texto):

DADOS_COLETADOS:{"titulo":"...","especialidade":"...","descricao":"...","cidade":"...","estado":"XX"}

Só envie o JSON quando tiver certeza de todos os campos. Até lá, continue conversando normalmente.`;

export async function enviarMensagemIA(historico) {
    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...historico,
            ],
            temperature: 0.7,
            max_tokens: 512,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || "Erro ao conectar com IA.");
    }

    return data?.choices?.[0]?.message?.content || "A IA não conseguiu responder.";
}

export function extrairDadosColetados(texto) {
    const match = texto.match(/DADOS_COLETADOS:(\{.*\})/);
    if (!match) return null;
    try {
        return JSON.parse(match[1]);
    } catch {
        return null;
    }
}