/** artifical delay */
export async function wait(ms = 2000) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
