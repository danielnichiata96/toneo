"""
Toneo - Azure TTS Service
Text-to-speech using Azure Cognitive Services.
"""
import hashlib
import os
from pathlib import Path
from typing import Optional

from app.core.config import settings


# Azure voice name mapping
VOICE_MAP = {
    "female1": "zh-CN-XiaoxiaoNeural",
    "female2": "zh-CN-XiaochenNeural",
    "female3": "zh-CN-XiaohanNeural",
    "female4": "zh-CN-XiaoyanNeural",
    "male1": "zh-CN-YunxiNeural",
    "male2": "zh-CN-YunyangNeural",
    "male3": "zh-CN-YunjianNeural",
}

# Cache directory
CACHE_DIR = Path(__file__).parent.parent.parent / "data" / "tts_cache"


def get_cache_path(text: str, voice: str, rate: float, pitch: float) -> Path:
    """Generate cache file path for TTS request."""
    cache_key = f"{text}_{voice}_{rate}_{pitch}"
    cache_hash = hashlib.md5(cache_key.encode()).hexdigest()
    return CACHE_DIR / f"{cache_hash}.mp3"


def is_tts_available() -> bool:
    """Check if Azure TTS is configured."""
    return bool(settings.azure_speech_key)


async def synthesize_speech(
    text: str,
    voice: str = "female1",
    rate: float = 1.0,
    pitch: float = 0.0,
    volume: float = 0.0,
) -> Optional[bytes]:
    """
    Synthesize speech from Chinese text using Azure TTS.

    Args:
        text: Chinese text to synthesize
        voice: Voice ID (female1, female2, male1, etc.)
        rate: Speech rate (0.5-2.0)
        pitch: Pitch adjustment (-50 to 50)
        volume: Volume adjustment (-50 to 50)

    Returns:
        MP3 audio bytes or None if synthesis fails
    """
    if not is_tts_available():
        return None

    # Check cache first
    cache_path = get_cache_path(text, voice, rate, pitch)
    if cache_path.exists():
        return cache_path.read_bytes()

    # Ensure cache directory exists
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    # Get Azure voice name
    azure_voice = VOICE_MAP.get(voice, VOICE_MAP["female1"])

    try:
        import azure.cognitiveservices.speech as speechsdk

        # Configure Azure Speech
        speech_config = speechsdk.SpeechConfig(
            subscription=settings.azure_speech_key,
            region=settings.azure_speech_region,
        )
        speech_config.set_speech_synthesis_output_format(
            speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
        )

        # Build SSML for fine control
        ssml = build_ssml(text, azure_voice, rate, pitch, volume)

        # Create synthesizer (no audio output, we want bytes)
        synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=speech_config,
            audio_config=None,
        )

        # Synthesize
        result = synthesizer.speak_ssml_async(ssml).get()

        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            audio_data = result.audio_data

            # Cache the result
            cache_path.write_bytes(audio_data)

            return audio_data

        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation = result.cancellation_details
            print(f"TTS canceled: {cancellation.reason}")
            if cancellation.error_details:
                print(f"Error details: {cancellation.error_details}")
            return None

    except ImportError:
        print("Azure Speech SDK not installed. Run: pip install azure-cognitiveservices-speech")
        return None
    except Exception as e:
        print(f"TTS error: {e}")
        return None


def build_ssml(
    text: str,
    voice: str,
    rate: float = 1.0,
    pitch: float = 0.0,
    volume: float = 0.0,
) -> str:
    """Build SSML for Azure TTS with prosody control."""
    # Convert rate to percentage (1.0 = 100%, 0.5 = 50%, 2.0 = 200%)
    rate_percent = int(rate * 100)

    # Pitch and volume as signed percentage
    pitch_str = f"{pitch:+.0f}%"
    volume_str = f"{volume:+.0f}%"

    ssml = f"""
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
        <voice name="{voice}">
            <prosody rate="{rate_percent}%" pitch="{pitch_str}" volume="{volume_str}">
                {text}
            </prosody>
        </voice>
    </speak>
    """
    return ssml.strip()


async def clear_cache() -> int:
    """Clear TTS cache. Returns number of files deleted."""
    if not CACHE_DIR.exists():
        return 0

    count = 0
    for file in CACHE_DIR.glob("*.mp3"):
        file.unlink()
        count += 1

    return count
