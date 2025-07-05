import type { ActionFunctionArgs } from "react-router";

import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

export async function action({ request }: ActionFunctionArgs) {
  // DELETE 요청만 허용
  if (request.method !== "DELETE") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user) {
      return data({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const filePath = formData.get("filePath") as string;

    if (!filePath) {
      return data({ error: "파일 경로가 필요합니다." }, { status: 400 });
    }

    // Supabase Storage에서 파일 삭제
    const { error: deleteError } = await client.storage
      .from("upload-medias")
      .remove([filePath]);

    if (deleteError) {
      console.error("Storage delete error:", deleteError);
      return data(
        {
          error: `파일 삭제 실패: ${deleteError.message}`,
        },
        { status: 500 },
      );
    }

    return data(
      {
        success: true,
        message: "파일이 성공적으로 삭제되었습니다.",
      },
      { headers },
    );
  } catch (error) {
    console.error("Delete API error:", error);
    return data(
      {
        error: "파일 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
