interface PerplexityRequest {
  model: string;
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
}

interface PerplexityUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  search_context_size: string;
  citation_tokens: number;
  num_search_queries: number;
  reasoning_tokens: number;
}

interface PerplexitySearchResult {
  title: string;
  url: string;
  date: string;
}

interface PerplexityChoice {
  index: number;
  finish_reason: string;
  message: {
    content: string;
    role: string;
  };
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: PerplexityUsage;
  object: string;
  choices: PerplexityChoice[];
  citations: string[];
  search_results: PerplexitySearchResult[];
}

// Perplexity API 호출 함수
export async function callPerplexityAPI(
  userPrompt: string,
): Promise<PerplexityResponse> {
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  if (!perplexityApiKey) {
    throw new Error("PERPLEXITY_API_KEY is not configured");
  }

  const systemMessage =
    "You are a trend analysis expert. Analyze the given keywords and provide accurate trend information in the requested JSON format. Be precise and concise.";

  const requestBody: PerplexityRequest = {
    model: "sonar",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  };

  console.log("Perplexity API Request:", {
    model: requestBody.model,
    systemMessage: requestBody.messages[0].content,
    userPrompt: requestBody.messages[1].content.substring(0, 200) + "...", // 로그 길이 제한
  });

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${perplexityApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Perplexity API error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  const result: PerplexityResponse = await response.json();

  console.log("Perplexity API Response:", {
    id: result.id,
    model: result.model,
    usage: result.usage,
    contentLength: result.choices[0]?.message?.content?.length || 0,
    finishReason: result.choices[0]?.finish_reason,
    searchResultsCount: result.search_results?.length || 0,
    citationsCount: result.citations?.length || 0,
  });

  if (!result.choices || result.choices.length === 0) {
    throw new Error("No choices received from Perplexity API");
  }

  const content = result.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content received from Perplexity API");
  }

  console.log(
    "Perplexity API Content (first 500 chars):",
    content.substring(0, 500),
  );

  return result;
}
