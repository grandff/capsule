import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  //  TODO 토큰을 조회해서 만료되었으면 새로 고침
  /**
     * 
     * 요청 샘플
     * curl -i -X GET "https://graph.threads.net/refresh_access_token
  ?grant_type=th_refresh_token
  &access_token=<LONG_LIVED_ACCESS_TOKEN>"

     * 응답 샘플
     * {
  "access_token": "<LONG_LIVED_USER_ACCESS_TOKEN>",
  "token_type": "bearer",
  "expires_in": 5183944 // number of seconds until token expires
}

     * 
     */
}
