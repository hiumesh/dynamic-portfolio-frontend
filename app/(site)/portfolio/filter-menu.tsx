"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Input } from "@nextui-org/react";
import _ from "lodash";
import { Search } from "lucide-react";
import { usePortfolioContext } from "./context";

export default function FilterMenu() {
  const { updateFilters } = usePortfolioContext();

  const handleInputChange = _.debounce((value?: string) => {
    updateFilters({ query: value }, { merge: true });
  }, 500);

  return (
    <MaxWidthWrapper className="sticky top-12 z-20 bg-background py-3 mb-3">
      <div>
        <Input
          className="max-w-xs"
          placeholder="Search..."
          onValueChange={handleInputChange}
          endContent={
            <Search className="text-gray-500" strokeWidth={1.4} size={18} />
          }
        />
      </div>
    </MaxWidthWrapper>
  );
}
