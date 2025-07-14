import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import { Button } from "~/core/components/ui/button";

interface SuccessAlertProps {
  show: boolean;
}

export function SuccessAlert({ show }: SuccessAlertProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert className="border-green-200 bg-green-50 text-green-800">
        <CheckCircle2Icon className="size-4 text-green-600" />
        <AlertDescription>
          홍보글이 성공적으로 업로드되었습니다!
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface DeleteConfirmAlertProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmAlert({
  show,
  onConfirm,
  onCancel,
}: DeleteConfirmAlertProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Alert className="w-96 border-red-200 bg-red-50 text-red-800">
        <AlertDescription className="space-y-4">
          <p>정말로 이 파일을 삭제하시겠습니까?</p>
          <div className="flex gap-2">
            <Button onClick={onConfirm} variant="destructive" size="sm">
              삭제
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              취소
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
