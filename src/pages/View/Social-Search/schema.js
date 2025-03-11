import { z } from 'zod';

export const filterFormSchema = z.object({
  filter_name: z.string().optional(),
  social_platform: z.array(z.string()).default([]),
  hashtag: z.array(z.string()).default([]),
  gender: z.array(z.string()).default([]),
  age: z.number().nullable().optional(),
  followers: z.number().nullable().optional(),
  keywords: z.array(z.string()).default([]),
  following_lists: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  location: z.array(z.string()).default([])
});
