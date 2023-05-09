import { defineLazyEventHandler } from 'h3'
import { prisma } from '../../db/index.js';

export default eventHandler(async (event) => {
    try {
        const result = await main(event);
        console.log('returning', result);
        return result;
      } catch (error) {
        console.error('Error in main function:', error);
      }
});

async function main(event) {
  const body = await readBody(event);
  console.log(body);
  const result = await prisma.TextChunks.findMany({skip: 0, take: 10, 
    where: {
    id: {
        in: body.id
    }
  }});

  return result;
}
