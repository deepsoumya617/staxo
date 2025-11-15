import z from 'zod'

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(255, 'Folder name is too long')
    .trim(),
  parentId: z.uuid('Invalid parentId format').nullable().optional(),
})
