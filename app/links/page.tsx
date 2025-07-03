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
    <div className="max-w-3xl mx-auto px-0 py-12 bg-[#09090b] text-[16px] leading-[24px]">
      <h1 className="text-4xl font-bold text-white mb-4 -ml-2">Articles</h1>
      <p className="text-gray-300 mb-6 -ml-2">
        Explore our collection of thoughts, insights, and explorations on
        culture, technology, and the arts.
      </p>
      <ul className="space-y-0.5 list-disc pl-1">
        {articles.map((article) => (
          <li key={article.slug} className="group">
            <Link href={`/article/${article.slug}`} className="block">
              <span className="text-white group-hover:text-blue-400 transition-colors duration-200">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
