import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";

export function BackButton() {
  return (
    <div className="flex items-center gap-4">
      <Link to="/dashboard/history">
        <Button
          variant="ghost"
          size="sm"
          className="dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>
      </Link>
    </div>
  );
}
