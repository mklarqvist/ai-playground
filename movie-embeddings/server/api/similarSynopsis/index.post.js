import { defineLazyEventHandler } from 'h3'
import { prisma } from '../../db/index.js';


export default eventHandler(async (event) => {
  const body = await readBody(event);
  return await main(body.ids);
});


async function main(ids) {
  const result = await prisma.Movie.findMany({
    where: {
        id: {in: ids},
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