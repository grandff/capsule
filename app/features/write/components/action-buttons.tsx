import { Loader2Icon, Upload } from "lucide-react";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/core/components/ui/dropdown-menu";
import { ThreadsLogo, XLogo } from "~/features/settings/screens/sns-connect";

interface ActionButtonsProps {
  isUploading: boolean;
  isFileUploading: boolean;
  onRewrite: () => void;
  onUpload: (platform: string) => void;
}

export function ActionButtons({
  isUploading,
  isFileUploading,
  onRewrite,
  onUpload,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4 pt-6">
      <Button
        onClick={onRewrite}
        variant="outline"
        className="px-8 py-3 text-lg"
      >
        다시 작성하기
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isUploading || isFileUploading}
            className="bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                업로드 중...
              </>
            ) : isFileUploading ? (
              <>
                <Loader2Icon className="mr-2 size-5 animate-spin" />
                파일 업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-5" />
                업로드하기
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onUpload("threads")}
            disabled={isUploading || isFileUploading}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-white">
                <ThreadsLogo />
              </div>
              Threads
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpload("x")}
            disabled={isUploading || isFileUploading}
            className="cursor-pointer opacity-50"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-white">
                <XLogo />
              </div>
              X (Twitter)
              <Badge variant="outline" className="ml-auto text-xs">
                Coming Soon
              </Badge>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
