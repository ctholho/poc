export function createActivities(server: string) {
  return {
    async read(fileName: string): Promise<string> {
      return await fetch(`${server}/read-file/${fileName}`).then((res) => res.text())
    },
    async write(fileName: string): Promise<string | void> {
      const request = await fetch(`${server}/create-file/${fileName}`, { method: 'POST' })
      const text = await request.text()
      if (text.startsWith('Error')) {
        throw new Error('nono');
      }
    },
  }
};
