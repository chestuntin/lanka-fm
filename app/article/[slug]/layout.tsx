import React from "react";

const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-3xl px-4">
        <header className="py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">About Us</h1>
        </header>
        <main className="py-8">{children}</main>
        <footer className="py-4 text-center text-sm text-gray-400">
          <p>© 2025 Your Website</p>
        </footer>
      </div>
    </div>
  );
};

export default ArticleLayout;
