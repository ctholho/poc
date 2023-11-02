export const createActivities = (server: string) => ({
  async read(fileName: string): Promise<string> {
    return await fetch(`${server}/read-file/${fileName}`).then((res) => res.text())
  },
  async write(fileName: string): Promise<string> {
    return await fetch(`${server}/read-file/${fileName}`).then((res) => res.text())
  },
});