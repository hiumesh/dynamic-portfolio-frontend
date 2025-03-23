import { useControllableState } from "@/hooks/use-controllable-state";
import { Chip } from "@heroui/react";
import { useState } from "react";

interface PropTypes {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export default function TagSelector({
  value: valueProp,
  onChange: onValueChange,
}: PropTypes) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });
  const [text, setText] = useState("");

  return (
    <div className="flex items-center gap-2">
      {value && value?.length > 0 ? (
        <ul className="flex items-center gap-2">
          {value?.map((tag, idx) => (
            <Chip
              key={tag}
              startContent={<span className="text-xs pl-1">#</span>}
              onClose={() => setValue(value?.filter((_, i) => i !== idx))}
            >
              {tag}
            </Chip>
          ))}
        </ul>
      ) : null}

      <input
        className="flex-1 min-w-11 font-light focus:outline-none text-lg"
        placeholder="Add up to 4 tags..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            if (text) {
              setValue(value ? [...value, text] : [text]);
              setText("");
            }
          }
          if (e.key === "Backspace") {
            if (!text) {
              setText(value ? value[value.length - 1] : "");
              setValue(value?.slice(0, -1));
            }
          }
        }}
      />
    </div>
  );
}
