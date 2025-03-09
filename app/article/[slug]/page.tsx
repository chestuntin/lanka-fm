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
import { TaskItem } from "@/components/ui/TaskItem"; // Import the TaskItem component
import Link from "next/link";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import remarkDeflist from "remark-deflist";
import { ReactNode } from "react";

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
      // Override the li component to detect and handle task list items
      li: (props: any) => {
        // For debugging
        // console.log("List item props:", JSON.stringify(props, null, 2));

        const firstChild = props.children && props.children[0];
        const isTaskItem =
          firstChild &&
          firstChild.props &&
          typeof firstChild.props.checked !== "undefined";

        if (isTaskItem) {
          // Extract the checked state
          const isChecked = firstChild.props.checked;

          // Try different ways to extract the text content
          let textContent = "";

          // Method 1: Check if there are direct children with text
          if (firstChild.props.children) {
            if (typeof firstChild.props.children === "string") {
              textContent = firstChild.props.children;
            } else if (Array.isArray(firstChild.props.children)) {
              textContent = firstChild.props.children.join("");
            }
          }

          // Method 2: Try to extract from the parent's other children
          if (
            !textContent &&
            Array.isArray(props.children) &&
            props.children.length > 1
          ) {
            // Combine all non-checkbox children
            textContent = props.children
              .slice(1)
              .map((child: any) => {
                if (typeof child === "string") return child;
                if (child?.props?.children) return child.props.children;
                return "";
              })
              .join("");
          }

          // Method 3: Extract from the siblings after the checkbox
          if (!textContent) {
            // Look for siblings after the checkbox
            const siblings = Array.isArray(props.children)
              ? props.children.slice(1)
              : [];
            textContent = siblings
              .map((sibling: any) => {
                if (typeof sibling === "string") return sibling;
                if (sibling?.props?.children) {
                  if (typeof sibling.props.children === "string") {
                    return sibling.props.children;
                  }
                  if (Array.isArray(sibling.props.children)) {
                    return sibling.props.children.join("");
                  }
                }
                return "";
              })
              .join("");
          }

          // If we have a parent list item, look for direct text content
          if (!textContent && props.node && props.node.children) {
            const textNodes = props.node.children.filter(
              (child: any) => child.type === "text"
            );
            textContent = textNodes.map((node: any) => node.value).join("");
          }

          // If we still don't have text content, try to use the input's value or placeholder
          if (!textContent && firstChild.props.value) {
            textContent = firstChild.props.value;
          }

          // For debugging only
          // console.log("Task item:", { isChecked, textContent });

          return (
            <TaskItem checked={isChecked} text={textContent || "Task Item"}>
              {textContent ? null : props.children}
            </TaskItem>
          );
        }

        // If not a task list item, render as normal li
        return <li {...props} />;
      },
      // Still override input for other checkboxes
      input: (props: any) => {
        if (props.type === "checkbox") {
          return (
            <input
              {...props}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          );
        }
        return <input {...props} />;
      },
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm, // This plugin is important for GitHub-flavored markdown which includes task lists
          remarkDeflist,
        ],
      },
    },
  });

  return (
    <article className="prose max-w-none overflow-visible prose-invert">
      <h1>{frontmatter?.title ?? "Untitled"}</h1>
      <p>{frontmatter?.description ?? "No description"}</p>
      {MdxContent}
    </article>
  );
}
