import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const remarkPlugins = [];
const rehypePlugins = [
  [
    rehypePrettyCode,
    {
      theme: "github-light",
      keepBackground: false,
      onVisitLine(node) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
    },
  ],
];

const withMDX = createMDX({
  extension: /\.mdx?$/,
  remarkPlugins,
  rehypePlugins,
});

export default withMDX(nextConfig);
