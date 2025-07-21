import { Search } from "lucide-react";

import { Input } from "~/core/components/ui/input";

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchSection({
  searchTerm,
  onSearchChange,
}: SearchSectionProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
      <Input
        type="text"
        placeholder="글 내용으로 검색하세요..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="py-3 pr-4 pl-10 text-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
      />
    </div>
  );
}
