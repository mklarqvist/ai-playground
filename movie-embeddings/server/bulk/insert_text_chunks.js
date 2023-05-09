const fs = require('fs');
const JSON5 = require('json5');
const Prisma = require('@prisma/client');
const { PrismaClient } = Prisma;
const prisma = new PrismaClient();


const parseJSON = (jsonStr) => {
    try {
        return JSON5.parse(jsonStr);
    } catch (err) {
        console.error('Error parsing JSON:', err);
        console.log(jsonStr);
        return null;
    }
};
async function bulkInsert(filepath) {
    prisma.TextChunks.deleteMany({}).then().catch((e) => {
      console.log('failure to delete all', e)
    });
  
    const batchSize = 1000; // Set the batch size to 1000 records
//   let batchNum = 0; // Initialize the batch number to 0
  let records = []; // Create an empty array to hold the records
  
    var array = fs.readFileSync(filepath).toString().split("\n");
    for(i in array) {
        if (array[i].length > 0){
            records.push(parseJSON(array[i]));
        }
        if (records.length === batchSize) {
            try {
                await prisma.TextChunks.createMany({ data: records }); // Use createMany to insert all records at once
                console.log('all done');
                records = []; // Reset the records array to empty
              } catch (error) {
                console.error('Error inserting records:', error);
              }
        }
    }

    if (records.length > 0) {
        console.log('inserting final', records.length, 'records')
    try {
            await prisma.TextChunks.createMany({ data: records }); // Use createMany to insert all records at once
            console.log('all done');
          } catch (error) {
            console.error('Error inserting records:', error);
          }
        }
  }
  

bulkInsert('../../preprocessing/all_text_chunks.jsonl')
