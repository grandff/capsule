import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import { Button } from "~/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";

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
  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 삭제 확인</DialogTitle>
          <DialogDescription>
            정말로 이 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            취소
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
