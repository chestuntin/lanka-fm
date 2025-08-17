// app/links/layout.tsx
export const runtime = "nodejs"; // ensure this whole segment runs on Node

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
