import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import type { NewThreadMedia } from "./schema";

// 키워드들 일괄 저장 또는 조회
async function saveOrGetKeywords(
  client: SupabaseClient<Database>,
  keywords: string[],
): Promise<number[]> {
  if (keywords.length === 0) return [];

  // 기존 키워드들 조회
  const { data: existingKeywords } = await client
    .from("keywords")
    .select("keyword_id, keyword")
    .in("keyword", keywords);

  const existingKeywordMap = new Map(
    existingKeywords?.map((k) => [k.keyword, k.keyword_id]) || [],
  );

  // 새로 저장할 키워드들 찾기
  const newKeywords = keywords.filter((k) => !existingKeywordMap.has(k));

  // 새 키워드들 일괄 저장
  if (newKeywords.length > 0) {
    const { data: insertedKeywords, error } = await client
      .from("keywords")
      .insert(
        newKeywords.map((keyword) => ({
          keyword,
          sort_seq: 0,
        })),
      )
      .select("keyword_id, keyword");

    if (error) {
      console.error("Error saving keywords:", error);
      throw error;
    }

    // 새로 저장된 키워드들도 맵에 추가
    insertedKeywords?.forEach((k) => {
      existingKeywordMap.set(k.keyword, k.keyword_id);
    });
  }

  // 모든 키워드 ID 반환
  return keywords.map((keyword) => existingKeywordMap.get(keyword)!);
}

// 속성들 일괄 저장 또는 조회
async function saveOrGetProperties(
  client: SupabaseClient<Database>,
  properties: Array<{
    property: string;
    propertyType: "mood" | "work";
  }>,
): Promise<number[]> {
  if (properties.length === 0) return [];

  // 기존 속성들 조회
  const { data: existingProperties } = await client
    .from("properties")
    .select("property_id, property, property_type")
    .in(
      "property",
      properties.map((p) => p.property),
    )
    .in(
      "property_type",
      properties.map((p) => p.propertyType),
    );

  const existingPropertyMap = new Map(
    existingProperties?.map((p) => [
      `${p.property}:${p.property_type}`,
      p.property_id,
    ]) || [],
  );

  // 새로 저장할 속성들 찾기
  const newProperties = properties.filter(
    (p) => !existingPropertyMap.has(`${p.property}:${p.propertyType}`),
  );

  // 새 속성들 일괄 저장
  if (newProperties.length > 0) {
    const { data: insertedProperties, error } = await client
      .from("properties")
      .insert(
        newProperties.map((prop) => ({
          property: prop.property,
          property_type: prop.propertyType,
          sort_seq: 0,
        })),
      )
      .select("property_id, property, property_type");

    if (error) {
      console.error("Error saving properties:", error);
      throw error;
    }

    // 새로 저장된 속성들도 맵에 추가
    insertedProperties?.forEach((p) => {
      existingPropertyMap.set(
        `${p.property}:${p.property_type}`,
        p.property_id,
      );
    });
  }

  // 모든 속성 ID 반환
  return properties.map(
    (prop) => existingPropertyMap.get(`${prop.property}:${prop.propertyType}`)!,
  );
}

// 미디어 파일 저장 (타입 오류 해결을 위해 임시로 any 사용)
export async function saveThreadMedia(
  client: SupabaseClient<Database>,
  mediaData: any,
): Promise<number> {
  const { data, error } = await client
    .from("thread_media")
    .insert(mediaData)
    .select("media_id")
    .single();

  if (error) {
    console.error("Error saving thread media:", error);
    throw error;
  }

  return data.media_id;
}

// 여러 미디어 파일 일괄 저장 (타입 오류 해결을 위해 임시로 any 사용)
export async function saveMultipleThreadMedia(
  client: SupabaseClient<Database>,
  mediaDataArray: any[],
): Promise<number[]> {
  if (mediaDataArray.length === 0) return [];

  const { data, error } = await client
    .from("thread_media")
    .insert(mediaDataArray)
    .select("media_id");

  if (error) {
    console.error("Error saving multiple thread media:", error);
    throw error;
  }

  return data.map((item) => item.media_id);
}

export async function saveThread(
  client: SupabaseClient<Database>,
  {
    shortText,
    thread,
    targetType,
    sendFlag,
    resultId,
    profileId,
    keywords = [],
    properties = [],
  }: {
    shortText: string;
    thread: string;
    targetType: "thread" | "X";
    sendFlag: boolean;
    resultId: string;
    profileId: string;
    keywords?: string[];
    properties?: Array<{
      property: string;
      propertyType: "mood" | "work";
    }>;
  },
) {
  // 키워드와 속성들을 먼저 저장/조회
  const keywordIds = await saveOrGetKeywords(client, keywords);
  const propertyIds = await saveOrGetProperties(client, properties);

  // threads 테이블에 저장 (키워드/속성 ID는 제거)
  const { data: threadData, error: threadError } = await client
    .from("threads")
    .insert({
      short_text: shortText,
      thread: thread,
      target_type: targetType,
      send_flag: sendFlag,
      result_id: resultId,
      profile_id: profileId,
    })
    .select("thread_id")
    .single();

  if (threadError) {
    console.error("Error saving thread:", threadError);
    throw threadError;
  }

  const threadId = threadData.thread_id;

  // 다대다 관계 테이블에 키워드 연결
  if (keywordIds.length > 0) {
    const { error: keywordError } = await client.from("thread_keywords").insert(
      keywordIds.map((keywordId) => ({
        thread_id: threadId,
        keyword_id: keywordId,
      })),
    );

    if (keywordError) {
      console.error("Error linking keywords:", keywordError);
      throw keywordError;
    }
  }

  // 다대다 관계 테이블에 속성 연결
  if (propertyIds.length > 0) {
    const { error: propertyError } = await client
      .from("thread_properties")
      .insert(
        propertyIds.map((propertyId) => ({
          thread_id: threadId,
          property_id: propertyId,
        })),
      );

    if (propertyError) {
      console.error("Error linking properties:", propertyError);
      throw propertyError;
    }
  }

  return threadId;
}

export async function updateThreadResultId(
  client: SupabaseClient<Database>,
  threadId: number,
  resultId: string,
) {
  const { error } = await client
    .from("threads")
    .update({ result_id: resultId })
    .eq("thread_id", threadId);

  if (error) {
    console.error("Error updating thread result_id:", error);
    throw error;
  }
}

export async function markThreadAsDeleted(
  client: SupabaseClient<Database>,
  threadId: number,
) {
  const { error } = await client
    .from("threads")
    .update({ result_id: "DELETED" })
    .eq("thread_id", threadId);

  if (error) {
    console.error("Error marking thread as deleted:", error);
    throw error;
  }
}
