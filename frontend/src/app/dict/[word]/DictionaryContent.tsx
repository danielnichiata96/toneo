'use client';

import { PlayButton } from '@/components/PlayButton';
import { ToneCurve } from '@/components/ToneCurve';
import { HanziWriterCompact } from '@/components/HanziWriterCompact';
import { getToneColor, getHskColor, getContrastColor, FREQUENCY_TIERS } from '@/lib/colors';
import { UI } from '@/lib/i18n';
import type { DictionaryEntry, ToneNumber } from '@/types/tone';

interface Props {
  entry: DictionaryEntry;
}

export function DictionaryContent({ entry }: Props) {
  const freqTier = entry.frequency_tier || 'unknown';
  const freqInfo = FREQUENCY_TIERS[freqTier as keyof typeof FREQUENCY_TIERS] || FREQUENCY_TIERS.unknown;
  const freqLabel = UI.frequencyLabels[freqTier] || freqTier;

  return (
    <article className="space-y-6">
      {/* Main word header */}
      <div className="bg-mao-white border-2 border-mao-black p-6 shadow-brutal">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-display font-bold text-mao-black mb-2">
              {entry.simplified}
            </h1>
            {entry.traditional && entry.traditional !== entry.simplified && (
              <p className="text-sm text-mao-black/50">
                Traditional: {entry.traditional}
              </p>
            )}
          </div>
          <PlayButton text={entry.simplified} size="lg" />
        </div>

        {/* Pinyin */}
        <p className="mt-4 font-mono text-2xl font-bold text-mao-black tracking-wide">
          {entry.pinyin}
        </p>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.hsk_level > 0 && (
            <span
              className="px-3 py-1 text-sm font-bold border border-mao-black/20"
              style={{
                backgroundColor: getHskColor(entry.hsk_level),
                color: getContrastColor(getHskColor(entry.hsk_level)),
              }}
            >
              HSK {entry.hsk_level <= 6 ? entry.hsk_level : '7-9'}
            </span>
          )}

          {entry.frequency !== null && (
            <span
              className="flex items-center gap-2 px-3 py-1 bg-mao-cream border border-mao-black/20"
              title={`Zipf frequency: ${entry.frequency.toFixed(1)}`}
            >
              <span className="text-sm font-medium text-mao-black/70">{freqLabel}</span>
              <span className="flex items-end gap-0.5">
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className="w-1.5 rounded-sm"
                    style={{
                      height: `${bar * 4 + 4}px`,
                      backgroundColor: bar <= freqInfo.bars ? freqInfo.color : '#D4D4D4',
                    }}
                  />
                ))}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Tone breakdown */}
      <div className="bg-mao-white border-2 border-mao-black p-6 shadow-brutal">
        <h2 className="text-xs font-bold text-mao-black/50 uppercase tracking-widest mb-6">
          Tone Breakdown
        </h2>
        <div className="flex gap-6 justify-center">
          {entry.simplified.split('').map((char, i) => {
            const tone = (entry.tones[i] || 5) as ToneNumber;
            const toneColor = getToneColor(tone);
            return (
              <div key={i} className="text-center">
                <span
                  className="text-4xl font-bold block font-display"
                  style={{ color: toneColor }}
                >
                  {char}
                </span>
                <div className="h-14 w-20 bg-mao-cream border-2 border-mao-black flex items-center justify-center my-3">
                  <ToneCurve tone={tone} size="md" />
                </div>
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: toneColor }}
                >
                  Tone {tone}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stroke order */}
      <div className="bg-mao-white border-2 border-mao-black p-6 shadow-brutal">
        <h2 className="text-xs font-bold text-mao-black/50 uppercase tracking-widest mb-6">
          Stroke Order
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {entry.simplified.split('').map((char, i) => (
            <HanziWriterCompact key={i} character={char} size={100} />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-mao-black/40">
          Click to replay animation
        </p>
      </div>

      {/* Definitions */}
      <div className="bg-mao-white border-2 border-mao-black p-6 shadow-brutal">
        <h2 className="text-xs font-bold text-mao-black/50 uppercase tracking-widest mb-4">
          Definitions
        </h2>
        <ol className="space-y-3">
          {entry.definitions.map((def, i) => (
            <li key={i} className="flex gap-3 text-lg text-mao-black">
              <span className="text-mao-black/30 font-mono font-bold">{i + 1}.</span>
              <span>{def}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Examples if available */}
      {entry.examples.length > 0 && (
        <div className="bg-mao-white border-2 border-mao-black p-6 shadow-brutal">
          <h2 className="text-xs font-bold text-mao-black/50 uppercase tracking-widest mb-4">
            Example Sentences
          </h2>
          <ul className="space-y-3">
            {entry.examples.map((example, i) => (
              <li key={i} className="text-mao-black/80 italic">
                &ldquo;{example}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
