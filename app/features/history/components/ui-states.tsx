import { Quote } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  );
}

export function EndOfListMessage() {
  return (
    <div className="text-muted-foreground py-4 text-center dark:text-gray-400">
      모든 글을 불러왔습니다.
    </div>
  );
}

interface NoSearchResultsProps {
  onClearSearch: () => void;
}

export function NoSearchResults({ onClearSearch }: NoSearchResultsProps) {
  return (
    <div className="py-8 text-center">
      <p className="text-muted-foreground dark:text-gray-400">
        검색 결과가 없습니다.
      </p>
      <Button
        variant="outline"
        onClick={onClearSearch}
        className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        검색어 지우기
      </Button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <Quote className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        아직 등록된 글이 없습니다
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md dark:text-gray-400">
        첫 번째 홍보글을 작성하고 소셜 미디어에서 효과적으로 마케팅을
        시작해보세요.
      </p>
      <Link to="/dashboard/write">
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
          새로운 글 작성하기
        </Button>
      </Link>
    </div>
  );
}
