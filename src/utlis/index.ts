const LLM_URL = process.env.LLM_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;
const SystemPrompt = "Kamu adalah sistem validasi pertanyaan permainan tanya-jawab untuk mempererat hubungan"

export function buildValidationPrompt(question: string, categoryName: string): string {
    return `
Evaluasi pertanyaan ini:

- Harus sopan & bebas ujaran kebencian
- Harus relevan dengan kategori: "${categoryName}"
- Harus bisa dijawab

Balas dalam format JSON:
{
  "is_valid": true|false,
  "alasan": "penjelasan singkat singkat!, atau kosong jika valid"
}

Pertanyaan: "${question}"
`.trim();

}

export async function validateWithAI(prompt: string): Promise<{
    isValid: boolean;
    reason: string;
}> {
    const response = await fetch(LLM_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${LLM_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: LLM_MODEL,
            messages: [
                { role: "system", content: SystemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0,
            /** max_tokens: 60, temporary disabled kadang membuat error karena 
             output tidak full menjadi format JSON */
            response_format: { type: "json_object" }
        }),
    });
    
    if (!response.ok) {
        throw new Error("Gagal melakukan validasi dengan AI");
    }
    
    const result = await response.json();
    const replyContent = result.choices?.[0]?.message?.content?.trim() || "";
    
    console.info({replyContent})

    const parsed = JSON.parse(replyContent)
    
    console.info({result})

    return {
        isValid: parsed.is_valid,
        reason: parsed.alasan,
    };
}
