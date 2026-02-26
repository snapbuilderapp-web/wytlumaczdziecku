import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const CATEGORY_THEMES: Record<string, { from: string; to: string; emoji: string }> = {
  science:    { from: '#0D9488', to: '#0891B2', emoji: '🔬' },
  history:    { from: '#92400E', to: '#B45309', emoji: '🏛️' },
  tech:       { from: '#1D4ED8', to: '#4F46E5', emoji: '💻' },
  nature:     { from: '#16A34A', to: '#0D9488', emoji: '🌿' },
  body:       { from: '#DC2626', to: '#DB2777', emoji: '🫀' },
  society:    { from: '#7C3AED', to: '#6D28D9', emoji: '🌍' },
  space:      { from: '#0F172A', to: '#1E1B4B', emoji: '🚀' },
  emotions:   { from: '#DB2777', to: '#9D174D', emoji: '💭' },
  philosophy: { from: '#D97706', to: '#B45309', emoji: '💡' },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title    = searchParams.get('t') ?? 'Wytłumacz Dziecku'
  const category = searchParams.get('c') ?? 'science'
  const hook     = searchParams.get('h') ?? ''

  const theme = CATEGORY_THEMES[category] ?? CATEGORY_THEMES.science

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${theme.from} 0%, ${theme.to} 100%)`,
          padding: '48px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle background pattern — two overlapping circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', display: 'flex',
        }} />

        {/* Category emoji */}
        <div style={{
          fontSize: '96px',
          lineHeight: 1,
          marginBottom: '32px',
          display: 'flex',
        }}>
          {theme.emoji}
        </div>

        {/* Title */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <div style={{
            fontSize: title.length > 30 ? '44px' : '54px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            display: 'flex',
            flexWrap: 'wrap',
          }}>
            {title}
          </div>

          {hook && (
            <div style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.4,
              display: 'flex',
              flexWrap: 'wrap',
            }}>
              {hook.length > 80 ? hook.slice(0, 80) + '…' : hook}
            </div>
          )}
        </div>

        {/* Branding footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '20px',
            fontWeight: 600,
            display: 'flex',
          }}>
            Wytłumacz Dziecku
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', display: 'flex' }}>
            dla dzieci i rodziców
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 800,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
