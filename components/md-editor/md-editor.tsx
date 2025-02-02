import "./markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useControllableState } from "@/hooks/use-controllable-state";
import rehypeSanitize from "rehype-sanitize";
import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";
import {
  Bold,
  Code,
  CodeSquare,
  Divide,
  Fullscreen,
  Heading,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  MoreHorizontal,
  MoreVertical,
  Quote,
  Strikethrough,
  Table,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface PropTypes {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const customCommands = [
  {
    ...commands.bold,
    icon: <Bold size={18} />,
  },
  {
    ...commands.italic,
    icon: <Italic size={18} />,
  },
  {
    ...commands.link,
    icon: <Link size={18} />,
  },
  {
    ...commands.orderedListCommand,
    icon: <ListOrdered size={18} />,
  },
  {
    ...commands.unorderedListCommand,
    icon: <List size={18} />,
  },
  {
    ...commands.title,
    icon: <Heading size={18} />,
  },
  {
    ...commands.quote,
    icon: <Quote size={18} />,
  },
  {
    ...commands.code,
    icon: <Code size={18} />,
  },
  {
    ...commands.codeBlock,
    icon: <CodeSquare size={18} />,
  },
  {
    ...commands.image,
    icon: <Image size={18} />,
  },
];

const customExtraCommands = [
  {
    ...commands.fullscreen,
    icon: <Fullscreen size={18} />,
  },
  commands.group(
    [
      {
        ...commands.strikethrough,
        icon: <Strikethrough size={18} />,
      },
      {
        ...commands.table,
        icon: <Table size={18} />,
      },
    ],
    {
      name: "more",
      groupName: "more",
      buttonProps: { "aria-label": "More Options" },
      icon: <MoreVertical size={18} />,
    }
  ),
];

export default function MDEditorComponent({
  value: valueProp,
  onChange: onValueChange,
  className,
}: PropTypes) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });
  return (
    <div className={cn("", className)}>
      <MDEditor
        height="500px"
        commands={customCommands}
        extraCommands={customExtraCommands}
        value={value}
        onChange={setValue}
        preview="edit"
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
}
