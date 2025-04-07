import { NextResponse } from 'next/server';

interface IConfig {
  pongMessage: string;
}

const CONFIG: IConfig = {
  pongMessage: 'pong',
};

interface IPingResponse {
  message: string;
}

export const GET = async (): Promise<NextResponse<IPingResponse>> => {
  return NextResponse.json({ message: CONFIG.pongMessage });
};
