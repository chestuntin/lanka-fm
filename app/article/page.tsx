import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  date: string;
}

export default async function ArticlesPage() {
  const contentDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(contentDir);

  const articles: Article[] = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(contentDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title || "Untitled",
        date: data.date || "No date",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-0 py-12 bg-black">
      <h1 className="text-4xl font-bold text-white mb-4 pl-0">Articles</h1>
      <ul className="space-y-0.5 list-disc pl-0">
        {articles.map((article) => (
          <li key={article.slug} className="group">
            <Link href={`/article/${article.slug}`} className="block">
              <span className="text-lg text-white group-hover:text-blue-400 transition-colors duration-200">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
