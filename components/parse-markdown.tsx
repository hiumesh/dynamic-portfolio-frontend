import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import matter from "gray-matter";

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

export default function RenderMarkdown({ markdown }: { markdown: string }) {
  const { content } = matter(markdown);
  const html = processor().processSync(content).toString();
  return (
    <div className="prose dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
