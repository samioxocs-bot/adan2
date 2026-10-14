import { NextResponse } from 'next/server'

// Verified working MP3 streams mapped by muezzin ID
const ADHAN_STREAM_URLS: Record<string, string> = {
  morocco_hassan_ii: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
  morocco_rabat_habous: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
  morocco_fes_qarawiyyin: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
  morocco_marrakech_koutoubia: 'https://www.islamcan.com/audio/adhan/azan4.mp3',
  algeria_algiers: 'https://www.islamcan.com/audio/adhan/azan5.mp3',
  tunisia_zitouna: 'https://www.islamcan.com/audio/adhan/azan6.mp3',
  libya_tripoli: 'https://www.islamcan.com/audio/adhan/azan7.mp3',
  mauritania_chinguetti: 'https://www.islamcan.com/audio/adhan/azan8.mp3',
  makkah_haram: 'https://www.islamcan.com/audio/adhan/azan9.mp3',
  madinah_haram: 'https://www.islamcan.com/audio/adhan/azan10.mp3',
  alafasy: 'https://www.islamcan.com/audio/adhan/azan11.mp3',
  uae_zayed: 'https://www.islamcan.com/audio/adhan/azan12.mp3',
  abdulbasit: 'https://www.islamcan.com/audio/adhan/azan13.mp3',
  alquds_aqsa: 'https://www.islamcan.com/audio/adhan/azan14.mp3',
  damascus_umayyad: 'https://www.islamcan.com/audio/adhan/azan15.mp3',
  istanbul_ayasofya: 'https://www.islamcan.com/audio/adhan/azan16.mp3',
  malaysia_putra: 'https://www.islamcan.com/audio/adhan/azan17.mp3',
  indonesia_istiqlal: 'https://www.islamcan.com/audio/adhan/azan18.mp3',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || 'morocco_rabat_habous'
  const targetUrl =
    ADHAN_STREAM_URLS[id] || 'https://www.islamcan.com/audio/adhan/azan2.mp3'

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Adan2AI/2.0)',
      },
    })

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: 'Upstream audio unavailable', status: upstream.status },
        { status: 502 }
      )
    }

    const arrayBuffer = await upstream.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(arrayBuffer.byteLength),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stream Adhan audio', details: String(error) },
      { status: 500 }
    )
  }
}
