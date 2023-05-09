import { defineLazyEventHandler } from 'h3'
import { prisma } from '../../db/index.js';

export default eventHandler(async (event) => {
    const id = parseInt(event.context.params.id)
    if (!Number.isInteger(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID should be an integer',
      })
    }
    return await main(id)
  })


  async function main(id) {
  const result = await prisma.Movie.findUnique({
    where: {
        id: id,
      },
  });

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