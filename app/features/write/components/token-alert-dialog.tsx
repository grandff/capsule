import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/core/components/ui/alert-dialog";

interface TokenAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export function TokenAlertDialog({
  open,
  onOpenChange,
  message,
}: TokenAlertDialogProps) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Threads 계정 연결 필요</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
            <br />
            <br />
            홍보글을 작성하려면 먼저 Threads 계정을 연결해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/dashboard/sns/connect")}>
            Threads 연결하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
