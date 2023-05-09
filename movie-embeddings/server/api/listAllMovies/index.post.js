import { defineLazyEventHandler } from 'h3'
import { prisma } from '../../db/index.js';

export default eventHandler(async (event) => {
    try {
        const result = await main(event);
        return result;
      } catch (error) {
        console.error('Error in main function:', error);
        // Return an appropriate error response
      }
});

async function main(event) {
  const body = await readBody(event);
  const result = await prisma.Movie.findMany({skip: 0, take: 10});

  return result;
}

// model TextChunks {
//   id          Int      @id @default(autoincrement()) @map(name: "_id")
//   tmdbId      Int
//   chunkNumber Int
//   text        String
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }