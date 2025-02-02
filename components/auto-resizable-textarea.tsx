import { useControllableState } from "@/hooks/use-controllable-state";
import { cn } from "@/lib/utils";
import React, { useRef, useLayoutEffect } from "react";

type AutoResizableTextareaProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const AutoResizableTextarea: React.FC<AutoResizableTextareaProps> = ({
  value: controlledValue,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  const [value, setValue] = useControllableState({
    prop: controlledValue,
    onChange,
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.max(newHeight, 0)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        rows={1}
        className={cn("resize-none", className)}
        placeholder={placeholder || "Type something..."}
        style={{ overflowY: "hidden" }}
        {...props}
      ></textarea>
    </div>
  );
};

export default AutoResizableTextarea;
