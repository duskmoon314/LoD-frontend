import { z, defineCollection } from "astro:content"

const aboutCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("暮月 Duskmoon"),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  }),
})

export const collections = {
  about: aboutCollection,
  blog: blogCollection,
}
