import { Badge } from "~/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

interface SelectedOptionsCardProps {
  moods: string[];
  keywords: string[];
  intents?: string[];
  length?: string;
  timeframe?: string;
  weather?: string;
}

export function SelectedOptionsCard({
  moods,
  keywords,
  intents,
  length,
  timeframe,
  weather,
}: SelectedOptionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">선택된 옵션</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium">분위기</h4>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Badge key={mood} variant="secondary">
                {mood}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium">키워드</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 추가된 옵션들 */}
        {intents && intents.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">의도</h4>
            <div className="flex flex-wrap gap-2">
              {intents.map((intent) => (
                <Badge key={intent} variant="secondary">
                  {intent}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {length && (
          <div>
            <h4 className="mb-2 font-medium">글 길이</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{length}</Badge>
            </div>
          </div>
        )}

        {timeframe && (
          <div>
            <h4 className="mb-2 font-medium">시점/상황</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{timeframe}</Badge>
            </div>
          </div>
        )}

        {weather && (
          <div>
            <h4 className="mb-2 font-medium">날씨</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{weather}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
