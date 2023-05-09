import { defineLazyEventHandler } from 'h3'
import { prisma } from '../../db/index.js';

export default eventHandler(async (event) => {
    const query = event.context.params.query
    return await main(query)
  })


  async function main(query) {
    var searchWords = query.split(" ")
    searchWords = searchWords.map(word => {
    // return `wildcard${word}wildcard`
        return `${word}:*`
    })
    const searchQuery = searchWords.join(" | ")

  const result = await prisma.Movie.findMany({
    take: 20,
    where: {
        title: {
            search: searchQuery
        },
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