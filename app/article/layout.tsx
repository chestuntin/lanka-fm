import React from "react";

const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      <div className="flex-grow">
        <div className="container mx-auto max-w-4xl mt-12 mb-8">
          <div className="bg-black rounded-2xl p-6 border border-gray-800">
            {children}
          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-[#d1d5da] mt-auto">
        <p>© copyright කල්චර් ®</p>
      </footer>
    </div>
  );
};

export default ArticleLayout;
