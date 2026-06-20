/* 
async delay utility
Used for:

- loading skeleton testing
- simulating latency
- UI transitions 
*/
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
