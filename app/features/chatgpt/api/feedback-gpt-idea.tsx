import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { type ActionFunctionArgs, data } from "react-router";
import { z } from "zod";

import { gptCompletion } from "~/utils/gpt-util";

const FeedbackSchema = z.object({
  systemPrompt: z.string({
    description: "시스템 프롬프트",
  }),
  prompt: z.string({
    description: "사용자 프롬프트",
  }),
  text: z.string({
    description: "피드백을 요청할 원본 텍스트",
  }),
  needs: z.string({
    description: "수정 요구사항",
  }),
  etc: z
    .string({
      description: "기타 요구사항",
    })
    .optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const {
    success,
    error,
    data: parsedData,
  } = FeedbackSchema.safeParse(Object.fromEntries(formData));

  console.log(parsedData);

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  const { systemPrompt, prompt } = parsedData;

  const fullPrompt = replaceFullPrompt(prompt, parsedData);

  const completion = await gptCompletion(fullPrompt, systemPrompt);
  if (!completion) {
    return data({ error: "Failed to generate feedback" }, { status: 500 });
  }

  return data({ completion }, { status: 200 });
}

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
