import z from 'zod'

// uploadUrl schema
export const getUploadUrlSchema = z.object({
  name: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long!')
    .trim(),
  mimeType: z.string(),
  size: z.number().min(1, 'Size must be > 0'),
  folderId: z.uuid().nullable().optional(),
})

// confirm upload schema
export const confirmFileUploadSchema = z.object({
  fileId: z.uuid('Invalid fileId format'),
  size: z.number(),
})

// part url schema
export const multipartPartUrlSchema = z.object({
  fileId: z.uuid('Invalid fileId format'),
  uploadId: z.uuid('Invalid uploadId format'),
  partNumber: z.number().min(1).max(10000), // s3 limit
})

// infer and export the types
export type GetUploadUrlType = z.infer<typeof getUploadUrlSchema> & {
  userId: string
}
export type ConfirmFileUploadType = z.infer<typeof confirmFileUploadSchema> & {
  userId: string
}
export type MultipartPartUrlType = z.infer<typeof multipartPartUrlSchema> & {
  userId: string
}
