import { Button } from "~/core/components/ui/button";

import {
  canCreatePromotion,
  getRequiredSelectionsMessage,
} from "../utils/validation-utils";

interface ProgressSectionProps {
  isCreatingPromotion: boolean;
  progress: number;
  canCreatePromotion: boolean;
  selectedMoods: string[];
  keywords: string[];
  selectedIntents: string[];
  onCreatePromotion: () => void;
}

export function ProgressSection({
  isCreatingPromotion,
  progress,
  canCreatePromotion: canCreate,
  selectedMoods,
  keywords,
  selectedIntents,
  onCreatePromotion,
}: ProgressSectionProps) {
  const requiredMessage = getRequiredSelectionsMessage(
    selectedMoods,
    keywords,
    selectedIntents,
  );

  return (
    <div className="flex flex-col items-center space-y-4 pt-6">
      {isCreatingPromotion && (
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              홍보글 생성 중...
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-green-600 dark:bg-green-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 필요한 선택사항 안내 */}
      {!canCreate && requiredMessage && (
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ {requiredMessage}
          </p>
        </div>
      )}

      {/* 홍보글 만들기 버튼 */}
      <Button
        disabled={!canCreate || isCreatingPromotion}
        onClick={onCreatePromotion}
        className={`px-8 py-5 text-lg font-semibold transition-all duration-300 ${
          canCreate && !isCreatingPromotion
            ? "bg-green-600 text-white shadow-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
        }`}
      >
        {isCreatingPromotion ? "생성 중..." : "홍보글 만들기"}
      </Button>
    </div>
  );
}
