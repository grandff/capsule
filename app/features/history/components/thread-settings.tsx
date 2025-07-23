import { Target } from "lucide-react";

import { Badge } from "~/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/core/components/ui/carousel";

interface ThreadSettingsProps {
  thread: any;
}

export function ThreadSettings({ thread }: ThreadSettingsProps) {
  const mediaFiles = thread.thread_media || [];

  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
          <Target className="h-5 w-5" />글 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 원본 메모 */}
        {thread.short_text && (
          <div>
            <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
              원본 메모
            </h4>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {thread.short_text}
              </p>
            </div>
          </div>
        )}

        {/* 속성들 */}
        <div>
          <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
            설정 정보
          </h4>
          <div className="flex flex-wrap gap-1">
            {thread.properties?.map((property: any, idx: number) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs dark:border-gray-600 dark:text-gray-300"
              >
                {property.property}
              </Badge>
            ))}
          </div>
        </div>

        {/* 키워드 */}
        <div>
          <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
            키워드
          </h4>
          <div className="flex flex-wrap gap-1">
            {thread.keywords?.map((keyword: any, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs dark:bg-gray-700 dark:text-gray-200"
              >
                #{keyword.keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 미디어 캐러셀 */}
        {mediaFiles.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
              첨부 미디어
            </h4>
            <Carousel className="w-full">
              <CarouselContent>
                {mediaFiles.map((media: any, idx: number) => (
                  <CarouselItem key={media.media_id || idx}>
                    <div className="rounded-lg border border-gray-200 p-2 dark:border-gray-600">
                      {media.media_type === "image" ? (
                        <img
                          src={media.public_url}
                          alt={media.original_filename || `이미지 ${idx + 1}`}
                          className="h-48 w-full rounded-md object-cover"
                          loading="lazy"
                        />
                      ) : media.media_type === "video" ? (
                        <video
                          src={media.public_url}
                          controls
                          className="h-48 w-full rounded-md object-cover"
                          preload="metadata"
                        >
                          <track kind="captions" />
                          브라우저가 비디오를 지원하지 않습니다.
                        </video>
                      ) : null}
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {media.original_filename}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {media.media_type === "image" ? "이미지" : "동영상"}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {mediaFiles.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
