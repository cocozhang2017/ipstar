import { ImageResponse } from 'next/og';

// 路由元数据:32x32 favicon,ImageResponse 自动输出 PNG
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * IPStar 品牌 favicon
 * 视觉:圆角菱形盾牌 + 星芒高光 + 中央 "IP" 衬线字体
 * 色彩:靛→紫→蓝 梯度(高端品牌感),金色星芒点缀
 */
export default function Icon() {
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
            'radial-gradient(circle at 30% 20%, #8b5cf6 0%, #6366f1 35%, #2563eb 70%, #0f172a 100%)',
          borderRadius: 16,
          boxShadow:
            'inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(0,0,0,0.25), 0 4px 20px rgba(99,102,241,0.45)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 左上星芒光晕 */}
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: -18,
            width: 56,
            height: 56,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(255,230,150,0.85) 0%, rgba(255,230,150,0) 60%)',
          }}
        />
        {/* 右下光泽 */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: -10,
            width: 58,
            height: 58,
            borderRadius: 999,
            background:
              'radial-gradient(circle, rgba(186,230,253,0.7) 0%, rgba(186,230,253,0) 65%)',
          }}
        />
        {/* 中央盾牌(圆角菱形) */}
        <div
          style={{
            width: 46,
            height: 50,
            borderRadius: '48% 48% 20% 20% / 35% 35% 15% 15%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(224,231,255,0.95) 55%, rgba(165,180,252,0.95) 100%)',
            boxShadow:
              'inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -4px 0 rgba(79,70,229,0.4), 0 2px 8px rgba(15,23,42,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transform: 'translateY(1px)',
          }}
        >
          {/* 盾牌描边 */}
          <div
            style={{
              position: 'absolute',
              inset: 3,
              borderRadius: '48% 48% 20% 20% / 35% 35% 15% 15%',
              border: '1.5px solid rgba(99,102,241,0.45)',
            }}
          />
          {/* 文字 IP — 粗体、深蓝、带光泽 */}
          <span
            style={{
              color: '#1e1b4b',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: -0.5,
              fontFamily:
                'ui-serif, Georgia, "Times New Roman", Times, serif',
              textShadow:
                '0 1px 0 rgba(255,255,255,0.7), 0 -1px 0 rgba(55,48,163,0.35)',
              transform: 'translateY(-1px)',
            }}
          >
            IP
          </span>
          {/* 盾牌顶星芒 */}
          <div
            style={{
              position: 'absolute',
              top: -3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 10,
              height: 10,
              background:
                'radial-gradient(circle, #fde68a 0%, rgba(253,224,71,0) 65%)',
            }}
          />
        </div>

        {/* 右上角 4 角小星 */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            background: '#fde68a',
            borderRadius: 999,
            boxShadow: '0 0 6px rgba(253,230,138,0.9)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
