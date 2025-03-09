import fs from "fs/promises";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MyButton } from "@/components/ui/MyButton";
import { Table } from "@/components/ui/Table";
import Link from "next/link";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const contentDir = path.join(process.cwd(), "content");

interface Frontmatter {
  title?: string;
  description?: string;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(contentDir, `${params.slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");

  const { content: MdxContent, frontmatter } = await compileMDX<Frontmatter>({
    source,
    components: {
      Carousel,
      CarouselContent,
      CarouselItem,
      CarouselPrevious,
      CarouselNext,
      Button,
      Card,
      CardContent,
      MyButton,
      Table,
      Link,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      },
    },
  });

  return (
    <article className="prose max-w-none overflow-visible dark:prose-invert">
      <h1>{frontmatter?.title ?? "Untitled"}</h1>
      <p>{frontmatter?.description ?? "No description"}</p>
      {MdxContent}
    </article>
  );
}
