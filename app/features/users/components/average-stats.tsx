import { NumberTicker } from "components/magicui/number-ticker";

import {
  getStatIconColor,
  getStatLabel,
  getStatSuffix,
} from "../utils/dashboard-utils";

interface AverageStatsProps {
  averages: {
    posts: number;
    likes: number;
    shares: number;
    comments: number;
    views: number;
    followers: number;
  };
}

export function AverageStats({ averages }: AverageStatsProps) {
  const statTypes = [
    "posts",
    "likes",
    "followers",
    "shares",
    "comments",
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-5 dark:bg-gray-800">
      {statTypes.map((statType) => (
        <div key={statType} className="text-center">
          <div className={`text-lg font-bold ${getStatIconColor(statType)}`}>
            <NumberTicker
              className={`text-lg font-bold ${getStatIconColor(statType)}`}
              value={averages[statType]}
            />
            {getStatSuffix(statType)}
          </div>
          <div className="text-muted-foreground text-xs">
            {getStatLabel(statType)}
          </div>
        </div>
      ))}
    </div>
  );
}
