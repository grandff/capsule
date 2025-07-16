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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">선택된 옵션</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 주요 옵션들 (분위기, 키워드) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              분위기
            </h4>
            <div className="flex flex-wrap gap-1">
              {moods.map((mood) => (
                <Badge key={mood} variant="secondary" className="text-xs">
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              키워드
            </h4>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 추가 옵션들 (의도, 길이, 시점, 날씨) */}
        {(intents?.length || length || timeframe || weather) && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {intents && intents.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  의도
                </h4>
                <div className="flex flex-wrap gap-1">
                  {intents.map((intent) => (
                    <Badge key={intent} variant="secondary" className="text-xs">
                      {intent}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {length && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  글 길이
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {length}
                </Badge>
              </div>
            )}

            {timeframe && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  시점/상황
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {timeframe}
                </Badge>
              </div>
            )}

            {weather && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  날씨
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {weather}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
