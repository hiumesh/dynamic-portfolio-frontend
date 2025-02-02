import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

export default function FilterMenu() {
  return (
    <MaxWidthWrapper>
      <div>
        <Input
          className="max-w-xs"
          placeholder="Search..."
          endContent={
            <Search className="text-gray-500" strokeWidth={1.4} size={18} />
          }
        />
      </div>
    </MaxWidthWrapper>
  );
}
