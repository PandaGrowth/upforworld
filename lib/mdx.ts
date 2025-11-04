import fs from "node:fs/promises";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";

export interface WritingFrontmatter {
  tldr?: string[];
  checklist?: string[];
  related?: { title: string; href: string }[];
}

export interface CaseFrontmatter {
  summary?: string;
  sop?: { title: string; description: string }[];
}

const rootDir = process.cwd();

async function readMdxFile(relativePath: string): Promise<string | null> {
  try {
    const fullPath = path.join(rootDir, relativePath);
    const file = await fs.readFile(fullPath, "utf8");
    return file;
  } catch (error) {
    console.warn(`MDX file not found: ${relativePath}`, error);
    return null;
  }
}

const mdxOptions = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            "aria-hidden": "true",
          },
        },
      ],
    ],
  },
} satisfies Parameters<typeof compileMDX>[0]["options"];

export async function getWritingContent(slug: string) {
  const source = await readMdxFile(path.join("content/writing", `${slug}.mdx`));
  if (!source) {
    return null;
  }

  const compiled = await compileMDX<WritingFrontmatter>({
    source,
    components: mdxComponents,
    options: mdxOptions,
  });

  return compiled;
}

export async function getCaseContent(slug: string) {
  const source = await readMdxFile(path.join("content/growth", `${slug}.mdx`));
  if (!source) {
    return null;
  }

  const compiled = await compileMDX<CaseFrontmatter>({
    source,
    components: mdxComponents,
    options: mdxOptions,
  });

  return compiled;
}
