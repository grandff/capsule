import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

interface OriginalTextCardProps {
  originalText: string;
}

export function OriginalTextCard({ originalText }: OriginalTextCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">원본 텍스트</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{originalText}</p>
      </CardContent>
    </Card>
  );
}
