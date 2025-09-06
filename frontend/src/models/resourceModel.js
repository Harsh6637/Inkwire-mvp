export function createResource({ name, content, tags, fileType, rawData }) {
  return {
    id: Date.now().toString(),
    name,
    content,
    tags,
    fileType,
    rawData,
    createdAt: new Date().toISOString()
  };
}
