'use client'

import { ToneCurve } from './ToneCurve'
import { UI } from '@/lib/i18n'
import { TONE_INFO, type ToneNumber } from '@/types/tone'

/**
 * Legend explaining the four tones.
 */
export function ToneLegend() {
  const tones: ToneNumber[] = [1, 2, 3, 4, 5]

  return (
    <div className="surface-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-semibold text-mao-black">
            {UI.legendTitle}
          </h3>
        </div>
        <span className="chip">{UI.legendBadge}</span>
      </div>

      {/* Tones grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tones.map((tone) => {
          const info = TONE_INFO[tone]
          return (
            <div
              key={tone}
              className="rounded-none border border-mao-black bg-mao-white p-3 text-center"
            >
              {/* Tone curve */}
              <div className="flex justify-center mb-3">
                <ToneCurve tone={tone} size="md" />
              </div>

              {/* Tone info */}
              <div>
                <div
                  className="text-lg font-bold font-display"
                  style={{ color: info.color }}
                >
                  {info.nameCn}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mao-black/50">
                  T{tone}
                </div>
                <div className="text-[10px] font-medium leading-tight text-mao-black/60 mt-2">
                  {info.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
