import { revalidateTag } from 'next/cache'

import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature)
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    if (!body?._type)
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })

    revalidateTag(body._type, { expire: 0 })

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
