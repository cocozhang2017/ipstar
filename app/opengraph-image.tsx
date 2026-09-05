import { ImageResponse } from 'next/og';

// 社交分享 OG 图 1200x630:品牌 Logo + 标语 + 奢华渐变背景
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 15% 15%, #8b5cf6 0%, #6366f1 22%, #4338ca 45%, #1e3a8a 72%, #0b1220 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 光晕层 */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -80,
            width: 560,
            height: 560,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(253,224,71,0.35) 0%, rgba(253,224,71,0) 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            right: -100,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(125,211,252,0.35) 0%, rgba(125,211,252,0) 62%)',
          }}
        />
        {/* 网格纹理 */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 78%)',
            opacity: 0.9,
          }}
        />

        {/* 顶部 Logo + 品牌 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 96,
              height: 104,
              borderRadius: '48% 48% 20% 20% / 35% 35% 15% 15%',
              background:
                'linear-gradient(180deg, #ffffff 0%, #e0e7ff 55%, #a5b4fc 100%)',
              boxShadow:
                'inset 0 4px 0 rgba(255,255,255,0.95), inset 0 -8px 0 rgba(79,70,229,0.4), 0 6px 24px rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                color: '#1e1b4b',
                fontWeight: 900,
                fontSize: 46,
                fontFamily:
                  'ui-serif, Georgia, "Times New Roman", Times, serif',
                textShadow:
                  '0 2px 0 rgba(255,255,255,0.7), 0 -2px 0 rgba(55,48,163,0.4)',
              }}
            >
              IP
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 58,
                fontWeight: 800,
                letterSpacing: -2,
                textShadow: '0 2px 16px rgba(79,70,229,0.5)',
              }}
            >
              IP
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                Star
              </span>
            </span>
            <span
              style={{
                fontSize: 20,
                opacity: 0.85,
                letterSpacing: 2,
                marginTop: 4,
              }}
            >
              FREE IP TOOLS FOR SELLERS &amp; DEVELOPERS
            </span>
          </div>
        </div>

        {/* 标语 */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 86,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: -2,
              margin: 0,
              maxWidth: 980,
              textShadow: '0 4px 28px rgba(15,23,42,0.5)',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            免费 IP 工具,
            <span
              style={{
                background:
                  'linear-gradient(135deg, #fde68a 0%, #f472b6 50%, #7dd3fc 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              {' '}
              给小卖家与独立开发者
            </span>
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 900,
              color: 'rgba(255,255,255,0.88)',
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
            }}
          >
            <span>IP 信誉 · 地理定位 · 代理检测 · 黑名单核验。</span>
            <span>技术向、轻量、不啰嗦 — 部署在 Cloudflare Global Edge。</span>
          </p>
        </div>

        {/* 底部三个价值徽章 */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            position: 'relative',
          }}
        >
          {[
            ['01', '信誉评分 0–100'],
            ['02', '全球地理定位'],
            ['03', '代理匿名级别'],
          ].map(([n, label]) => (
            <div
              key={n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 22px',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: 14,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background:
                    'linear-gradient(135deg, #fde68a, #f59e0b)',
                  color: '#1c1917',
                  fontWeight: 800,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {n}
              </span>
              <span style={{ fontSize: 20, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
