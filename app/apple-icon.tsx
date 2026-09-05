import { ImageResponse } from 'next/og';

// Apple 主屏幕图标 180x180:与 favicon 同视觉但更大,加外圈白色内边距
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 28% 22%, #a78bfa 0%, #818cf8 28%, #4f46e5 60%, #1e1b4b 100%)',
          borderRadius: 42,
          boxShadow:
            'inset 0 6px 0 rgba(255,255,255,0.3), inset 0 -10px 0 rgba(0,0,0,0.25), 0 10px 40px rgba(79,70,229,0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 顶部星芒 */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(254,240,138,0.85) 0%, rgba(254,240,138,0) 60%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            right: -30,
            width: 200,
            height: 200,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(191,219,254,0.65) 0%, rgba(191,219,254,0) 65%)',
          }}
        />
        {/* 盾牌 */}
        <div
          style={{
            width: 128,
            height: 140,
            borderRadius: '48% 48% 20% 20% / 35% 35% 15% 15%',
            background:
              'linear-gradient(180deg, #ffffff 0%, #e0e7ff 55%, #a5b4fc 100%)',
            boxShadow:
              'inset 0 6px 0 rgba(255,255,255,0.95), inset 0 -10px 0 rgba(79,70,229,0.4), 0 6px 22px rgba(15,23,42,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 8,
              borderRadius: '48% 48% 20% 20% / 35% 35% 15% 15%',
              border: '3px solid rgba(99,102,241,0.45)',
            }}
          />
          <span
            style={{
              color: '#1e1b4b',
              fontWeight: 900,
              fontSize: 64,
              letterSpacing: -2,
              fontFamily:
                'ui-serif, Georgia, "Times New Roman", Times, serif',
              textShadow:
                '0 2px 0 rgba(255,255,255,0.7), 0 -2px 0 rgba(55,48,163,0.4)',
              transform: 'translateY(-2px)',
            }}
          >
            IP
          </span>
          {/* 顶星 */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 28,
              height: 28,
              background:
                'radial-gradient(circle, #fde68a 0%, rgba(253,224,71,0) 70%)',
            }}
          />
        </div>
        {/* 右上角星点 */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 14,
            height: 14,
            background: '#fde68a',
            borderRadius: 999,
            boxShadow: '0 0 14px rgba(253,230,138,0.9)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 22,
            width: 8,
            height: 8,
            background: '#fff',
            borderRadius: 999,
            opacity: 0.7,
            boxShadow: '0 0 8px rgba(255,255,255,0.9)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
