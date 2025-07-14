import { ChevronDownIcon } from "lucide-react";

import {
  LENGTH_OPTIONS,
  TIMEFRAME_OPTIONS,
  WEATHER_OPTIONS,
} from "~/constants";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";

interface AdvancedSettingsSectionProps {
  showAdvancedSettings: boolean;
  onToggleAdvancedSettings: () => void;
  selectedLength: string;
  onLengthSelect: (length: string) => void;
  selectedTimeframe: string;
  onTimeframeSelect: (timeframe: string) => void;
  selectedWeather: string;
  onWeatherSelect: (weather: string) => void;
}

export function AdvancedSettingsSection({
  showAdvancedSettings,
  onToggleAdvancedSettings,
  selectedLength,
  onLengthSelect,
  selectedTimeframe,
  onTimeframeSelect,
  selectedWeather,
  onWeatherSelect,
}: AdvancedSettingsSectionProps) {
  return (
    <>
      {/* 더 자세하게 설정하기 버튼 */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onToggleAdvancedSettings}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          더 자세하게 설정하기
          <ChevronDownIcon
            className={`size-4 transition-transform duration-200 ${
              showAdvancedSettings ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* 고급 설정 영역 */}
      {showAdvancedSettings && (
        <div
          className="space-y-8 border-t border-gray-200 pt-8 dark:border-gray-700"
          style={{
            animation: "slideDown 0.3s ease-out forwards",
          }}
        >
          {/* 글 길이 선택 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              얼마나 길게 쓸까요?
            </h3>
            <div className="flex flex-wrap gap-3">
              {LENGTH_OPTIONS.map((length) => (
                <Badge
                  key={length}
                  variant={selectedLength === length ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    selectedLength === length
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onLengthSelect(length)}
                >
                  {length}
                </Badge>
              ))}
            </div>
          </div>

          {/* 시점/상황 설정 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              언제/어떤 상황에 맞는 글인가요?
            </h3>
            <div className="flex flex-wrap gap-3">
              {TIMEFRAME_OPTIONS.map((timeframe) => (
                <Badge
                  key={timeframe}
                  variant={
                    selectedTimeframe === timeframe ? "default" : "outline"
                  }
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    selectedTimeframe === timeframe
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onTimeframeSelect(timeframe)}
                >
                  {timeframe}
                </Badge>
              ))}
            </div>
          </div>

          {/* 날씨 선택 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              어떤 날씨에 어울리는 글인가요?
            </h3>
            <div className="flex flex-wrap gap-3">
              {WEATHER_OPTIONS.map((weather) => (
                <Badge
                  key={weather}
                  variant={selectedWeather === weather ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    selectedWeather === weather
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onWeatherSelect(weather)}
                >
                  {weather}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
