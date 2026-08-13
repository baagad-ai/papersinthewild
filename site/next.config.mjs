import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Papers in the Wild — Next.js config.
 *
 * Currently deployed at the GitHub project-pages URL:
 *   https://baagad-ai.github.io/papersinthewild/
 *
 * The basePath makes Next.js emit asset URLs prefixed with
 * `/papersinthewild/` so they resolve under the project subpath.
 *
 * WHEN YOU MOVE TO A CUSTOM DOMAIN (papersinthewild.io):
 *   1. Remove basePath below (or set to "")
 *   2. Add public/CNAME with contents: papersinthewild.io
 *   3. Configure DNS to point papersinthewild.io at GitHub Pages
 *   4. In GitHub repo Settings → Pages → Custom domain, enter papersinthewild.io
 *   5. Re-push to trigger a fresh build
 */
const SITE_BASE_PATH = "/papersinthewild";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: SITE_BASE_PATH,
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
