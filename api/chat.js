import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ chấp nhận POST" });
  }

  const { message } = req.body;

  const systemPrompt = `
Bạn là trợ lý học đường cho học sinh Việt Nam.

Cách trả lời:
- Luôn đồng cảm trước, không phán xét
- Xưng hô: thầy/cô – em
- Ngôn ngữ nhẹ nhàng, gần gũi
- Hỗ trợ các vấn đề: bạo lực học đường, bắt nạt trên mạng,
  an toàn giao thông, sức khỏe sinh sản vị thành niên,
  áp lực học tập, mâu thuẫn bạn bè
- Khi vấn đề nghiêm trọng, khuyên em báo cho thầy cô
- Luôn kèm link hỗ trợ trực tiếp:
https://forms.gle/PWc5rKJEGZw564zD8
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      reply: "Thầy/cô xin lỗi, hệ thống đang gặp sự cố. Em thử lại sau nhé."
    });
  }
}
