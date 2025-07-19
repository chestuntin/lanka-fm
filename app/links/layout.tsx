import React from "react";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";

const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[100svh] bg-[#09090b] text-white flex flex-col justify-between">
      <div className="flex-grow">
        <div className="container mx-auto max-w-4xl mt-12 mb-8">
          <div className="px-6 py-3 mb-4 flex justify-center">
            <DynamicBreadcrumb />
          </div>
          <div className="bg-[#09090b] rounded-[0.6rem] p-6">{children}</div>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-[#d1d5da] mt-auto">
        <p>© copyright කල්චර් ®</p>
      </footer>
    </div>
  );
};

export default ArticleLayout;
