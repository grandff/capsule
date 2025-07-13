import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { type ActionFunctionArgs, data } from "react-router";
import { z } from "zod";

const openai = new OpenAI();
const IdeaSchema = z.object({
  prompt: z.string(),
  text: z.string({
    description:
      "오늘 있었던 일, 느낀 점, 또는 전하고 싶은 메시지. 최대 100글자 이내로 입력함.",
  }),
  mood: z.string({
    description: "사용자가 원하는 분위기를 선택함.",
  }),
  keyword: z.string({
    description: "사용자가 원하는 키워드를 입력함.",
  }),
  intent: z.string({
    description: "사용자가 원하는 글의 목적을 선택함.",
  }),
  length: z
    .string({
      description: "사용자가 원하는 글의 길이를 선택함.",
    })
    .optional(),
  timeframe: z
    .string({
      description: "사용자가 원하는 시점/상황을 선택함.",
    })
    .optional(),
  weather: z
    .string({
      description: "사용자가 원하는 날씨를 선택함.",
    })
    .optional(),
});
// const ResponseSchema = z.object({
//   ideas: z.array(IdeaSchema).max(500),
// });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log("formData");
  console.log(formData);
  const {
    success,
    error,
    data: parsedData,
  } = IdeaSchema.safeParse(Object.fromEntries(formData));

  console.log(parsedData);

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  const { prompt } = parsedData;
  console.log(`prompt : ${prompt}`);

  const fullPrompt = replaceFullPrompt(prompt, parsedData);
  console.log(`fullPrompt : ${fullPrompt}`);

  const completion = await gptCompletion(fullPrompt);
  if (!completion) {
    return data({ error: "Failed to generate ideas" }, { status: 500 });
  }

  return data({ completion }, { status: 200 });
}

// TODO 오류처리 해야함
const gptCompletion = async (prompt: string) => {
  try {
    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
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

const replaceFullPrompt = (
  prompt: string,
  variables: Record<string, string>,
) => {
  let result = prompt;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value);
  });

  return result;
};
