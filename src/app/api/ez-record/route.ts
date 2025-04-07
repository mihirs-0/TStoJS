import { TEntWithObjectIdsMappedToString } from '@/services/ent/base/TEntWithObjectIdsMappedToString';
import { EntEzRecord } from '@/services/ent/ez-record/EntEzRecord';
import { IEntEzRecord } from '@/services/ent/ez-record/IEntEzRecord';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<
  NextResponse<TEntWithObjectIdsMappedToString<IEntEzRecord>>
> => {
  const ezRecord = await genOrCreateEzRecord();
  return NextResponse.json(ezRecord.getModelWithStringIds());
};

async function genOrCreateEzRecord(): Promise<EntEzRecord> {
  const ezRecord = await EntEzRecord.genQueryOne({});
  if (ezRecord != null) {
    console.log('EzRecord already exists.');
    return ezRecord;
  }

  console.log('Creating EzRecord...');
  const insertedId = await EntEzRecord.genCreateOne({
    _id: new ObjectId(),
    created_date: new Date(),
    some_string: 'Hello, World!',
  });

  return EntEzRecord.genEnforce(insertedId.toString());
}
