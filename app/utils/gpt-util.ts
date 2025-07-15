import OpenAI from "openai";

const openai = new OpenAI();
// TODO 오류처리 해야함
export const gptCompletion = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // return result
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return null;
  }
};
