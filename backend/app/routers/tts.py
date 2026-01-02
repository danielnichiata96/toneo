"""
Toneo - TTS Router
Text-to-speech endpoints using Azure Cognitive Services.

Security notes:
- Rate limited to 30 req/min per IP (see rate_limit.py)
- Text length capped at 200 chars to prevent abuse
- TODO: Add user auth + per-user quotas when Supabase is integrated
"""
import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response

from app.models.schemas import TTSRequest, VoicesResponse, VoiceInfo
from app.services.tts import synthesize_speech, is_tts_available
from app.core.rate_limit import limiter, TTS_RATE_LIMIT

logger = logging.getLogger(__name__)

# Max characters per TTS request (prevent abuse)
MAX_TTS_CHARS = 200

router = APIRouter()


# Available Chinese voices (Azure Neural TTS)
CHINESE_VOICES = {
    "female1": VoiceInfo(name="Xiaoxiao", gender="female", locale="zh-CN"),
    "female2": VoiceInfo(name="Xiaochen", gender="female", locale="zh-CN"),
    "female3": VoiceInfo(name="Xiaohan", gender="female", locale="zh-CN"),
    "female4": VoiceInfo(name="Xiaoyan", gender="female", locale="zh-CN"),
    "male1": VoiceInfo(name="Yunxi", gender="male", locale="zh-CN"),
    "male2": VoiceInfo(name="Yunyang", gender="male", locale="zh-CN"),
    "male3": VoiceInfo(name="Yunjian", gender="male", locale="zh-CN"),
}


@router.get("/tts/voices", response_model=VoicesResponse)
async def get_voices() -> VoicesResponse:
    """Get available TTS voices."""
    return VoicesResponse(voices=CHINESE_VOICES)


@router.post("/tts")
@limiter.limit(TTS_RATE_LIMIT)
async def tts_synthesize(request: Request, tts_request: TTSRequest) -> Response:
    """
    Synthesize speech from Chinese text.

    Rate limited to 30 requests per minute per IP.
    Max 200 characters per request.
    Returns MP3 audio bytes.
    """
    # Validate text length
    if len(tts_request.text) > MAX_TTS_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Text too long. Maximum {MAX_TTS_CHARS} characters allowed."
        )

    if not is_tts_available():
        raise HTTPException(
            status_code=503,
            detail="TTS service temporarily unavailable."
        )

    try:
        audio_data = await synthesize_speech(
            text=tts_request.text,
            voice=tts_request.voice,
            rate=tts_request.rate,
            pitch=tts_request.pitch,
            volume=tts_request.volume,
        )
    except Exception as e:
        logger.exception("TTS synthesis failed")
        raise HTTPException(
            status_code=500,
            detail="Speech synthesis failed. Please try again."
        )

    if audio_data is None or len(audio_data) == 0:
        raise HTTPException(
            status_code=500,
            detail="Speech synthesis failed. Please try again."
        )

    return Response(
        content=audio_data,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="tts.mp3"',
            "Cache-Control": "public, max-age=86400",
        },
    )


@router.get("/tts/health")
async def tts_health():
    """Check TTS service health."""
    available = is_tts_available()
    return {
        "status": "available" if available else "unavailable",
        "engine": "Azure Speech AI",
        "message": "TTS ready" if available else "Configure AZURE_SPEECH_KEY in .env",
    }


# Cache clear endpoint removed for security
# Use admin tools or manual cleanup if needed
