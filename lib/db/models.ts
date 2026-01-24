import { getDatabase } from './mongodb';
import { Invoice, Supplier, InvoiceItemDocument, Transaction, InventoryItem } from '@/types/invoice';
import { Db, Collection } from 'mongodb';

export async function getInvoicesCollection(): Promise<Collection<Invoice>> {
  const db = await getDatabase();
  const collection = db.collection<Invoice>('invoices');
  
  // Create indexes
  await collection.createIndex({ invoice_number: 1 }, { unique: true });
  await collection.createIndex({ supplier_name: 1 });
  await collection.createIndex({ created_at: -1 });
  await collection.createIndex({ validation_status: 1 });
  
  return collection;
}

export async function getSuppliersCollection(): Promise<Collection<Supplier>> {
  const db = await getDatabase();
  const collection = db.collection<Supplier>('suppliers');
  
  await collection.createIndex({ name: 1 }, { unique: true });
  
  return collection;
}

export async function getInvoiceItemsCollection(): Promise<Collection<InvoiceItemDocument>> {
  const db = await getDatabase();
  const collection = db.collection<InvoiceItemDocument>('invoice_items');
  
  await collection.createIndex({ invoice_id: 1 });
  
  return collection;
}

export async function getTransactionsCollection(): Promise<Collection<Transaction>> {
  const db = await getDatabase();
  const collection = db.collection<Transaction>('transactions');
  
  await collection.createIndex({ invoice_id: 1 });
  await collection.createIndex({ date: -1 });
  await collection.createIndex({ type: 1 });
  
  return collection;
}

export async function getInventoryCollection(): Promise<Collection<InventoryItem>> {
  const db = await getDatabase();
  const collection = db.collection<InventoryItem>('inventory');
  
  await collection.createIndex({ item_name: 1 }, { unique: true });
  
  return collection;
}

// Vector similarity search using cosine similarity
export async function vectorSimilaritySearch(
  queryEmbedding: number[],
  collectionName: 'invoices' | 'transactions',
  limit: number = 5
): Promise<any[]> {
  const db = await getDatabase();
  const collection = db.collection(collectionName);
  
  // Calculate cosine similarity for each document
  const pipeline = [
    {
      $addFields: {
        similarity: {
          $let: {
            vars: {
              dotProduct: {
                $reduce: {
                  input: { $range: [0, { $size: '$embedding' }] },
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $multiply: [
                          { $arrayElemAt: ['$embedding', '$$this'] },
                          { $arrayElemAt: [queryEmbedding, '$$this'] }
                        ]
                      }
                    ]
                  }
                }
              },
              magnitudeA: {
                $sqrt: {
                  $reduce: {
                    input: '$embedding',
                    initialValue: 0,
                    in: { $add: ['$$value', { $multiply: ['$$this', '$$this'] }] }
                  }
                }
              },
              magnitudeB: {
                $sqrt: {
                  $reduce: {
                    input: queryEmbedding,
                    initialValue: 0,
                    in: { $add: ['$$value', { $multiply: ['$$this', '$$this'] }] }
                  }
                }
              }
            },
            in: {
              $divide: [
                '$$dotProduct',
                { $multiply: ['$$magnitudeA', '$$magnitudeB'] }
              ]
            }
          }
        }
      }
    },
    { $match: { embedding: { $exists: true, $ne: null } } },
    { $sort: { similarity: -1 } },
    { $limit: limit },
    { $project: { similarity: 1, embedding: 0 } }
  ];
  
  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

