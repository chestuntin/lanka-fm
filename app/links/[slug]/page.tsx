// app/links/[slug]/page.tsx
export const runtime = "nodejs"; // required for fs/compileMDX on Vercel
export const dynamic = "force-dynamic"; // reading from filesystem per request

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
import { TaskItem } from "@/components/ui/TaskItem";
import Link from "next/link";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import remarkDeflist from "remark-deflist";

import {
  MotionDiv,
  MotionHeading,
  MotionParagraph,
  MotionSpan,
  MotionSection,
} from "@/components/ClientMotion";
import { BouncyBall } from "@/components/ReactSpring";

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
  let source: string;

  try {
    source = await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    return (
      <div className="w-full px-4 py-6 bg-black text-white">
        <h1>Error loading content</h1>
        <p>Could not find or read the requested article.</p>
      </div>
    );
  }

  const { content: MdxContent, frontmatter } = await compileMDX<Frontmatter>({
    source,
    components: {
      Carousel,
      CarouselContent,
      CarouselItem,
      CarouselPrevious: (props) => (
        <CarouselPrevious
          {...props}
          className="bg-gray-800 text-white hover:bg-gray-700"
        />
      ),
      CarouselNext: (props) => (
        <CarouselNext
          {...props}
          className="bg-gray-800 text-white hover:bg-gray-700"
        />
      ),
      Button,
      Card,
      CardContent,
      MyButton,
      Table,
      Link,
      MotionDiv,
      MotionHeading,
      MotionParagraph,
      MotionSpan,
      MotionSection,
      BouncyBall,
      li: (props: any) => {
        const firstChild = props.children && props.children[0];
        const isTaskItem =
          firstChild &&
          firstChild.props &&
          typeof firstChild.props.checked !== "undefined";

        if (isTaskItem) {
          const isChecked = firstChild.props.checked;
          let textContent = "";

          if (firstChild.props.children) {
            if (typeof firstChild.props.children === "string")
              textContent = firstChild.props.children;
            else if (Array.isArray(firstChild.props.children))
              textContent = firstChild.props.children.join("");
          }

          if (
            !textContent &&
            Array.isArray(props.children) &&
            props.children.length > 1
          ) {
            textContent = props.children
              .slice(1)
              .map((child: any) =>
                typeof child === "string" ? child : child?.props?.children ?? ""
              )
              .join("");
          }

          if (!textContent && props.node?.children) {
            const textNodes = props.node.children.filter(
              (c: any) => c.type === "text"
            );
            textContent = textNodes.map((n: any) => n.value).join("");
          }

          return (
            <TaskItem checked={isChecked} text={textContent || "Task Item"}>
              {textContent ? null : props.children}
            </TaskItem>
          );
        }

        return <li {...props} />;
      },
      input: (props: any) =>
        props.type === "checkbox" ? (
          <input
            {...props}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
          />
        ) : (
          <input {...props} />
        ),
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          remarkDeflist,
        ],
      },
    },
  });

  return (
    <div className="w-full px-4 py-0 bg-[#09090b]">
      <article className="prose prose-invert w-full max-w-none [&_*]:mx-0 bg-[#09090b] -mt-2">
        <h1>{frontmatter?.title ?? "Untitled"}</h1>
        <p>{frontmatter?.description ?? "No description"}</p>
        {MdxContent}
      </article>
    </div>
  );
}
