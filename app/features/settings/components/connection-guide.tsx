import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export default function ConnectionGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>연결 가이드</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-semibold">연결 방법</h4>
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>연결하고 싶은 SNS 플랫폼의 "연결하기" 버튼을 클릭하세요.</li>
            <li>해당 플랫폼의 로그인 페이지로 이동합니다.</li>
            <li>계정 정보를 입력하고 권한을 승인하세요.</li>
            <li>
              연결이 완료되면 내가 작성한 글을 자동으로 업로드할 수 있습니다.
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">연결 해제</h4>
          <p className="text-muted-foreground text-sm">
            "연결 해제" 버튼을 클릭하면 언제든지 연결을 해제할 수 있습니다. 연결
            해제 후에는 해당 플랫폼으로 자동 업로드가 중단됩니다.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">권한 안내</h4>
          <p className="text-muted-foreground text-sm">
            연결 시 필요한 최소한의 권한만 요청합니다. 계정 정보나 개인
            메시지에는 접근하지 않으며, 오직 홍보글 업로드와 기본 통계 확인만을
            위한 권한을 요청합니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
