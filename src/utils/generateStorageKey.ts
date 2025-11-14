export function generateStorageKey({
  userId,
  fileId,
  fileName,
  folderId,
}: {
  userId: string
  fileId: string
  fileName: string
  folderId?: string | null
}) {
  const safeFileName = fileName.replace(/\s+/g, '_')
  const finalFileName = `${fileId}_${safeFileName}`

  if (!folderId) {
    return `users/${userId}/files/${finalFileName}`
  }

  return `users/${userId}/folders/${folderId}/files/${finalFileName}`
}
