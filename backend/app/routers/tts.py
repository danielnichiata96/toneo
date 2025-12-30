"""
Toneo - TTS Router
Text-to-speech endpoints using Azure Cognitive Services.
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.models.schemas import TTSRequest, VoicesResponse, VoiceInfo
from app.services.tts import synthesize_speech, is_tts_available, clear_cache


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
async def tts_synthesize(request: TTSRequest) -> Response:
    """
    Synthesize speech from Chinese text.

    Returns MP3 audio bytes.
    """
    if not is_tts_available():
        raise HTTPException(
            status_code=503,
            detail="TTS service unavailable. Configure AZURE_SPEECH_KEY in .env"
        )

    audio_data = await synthesize_speech(
        text=request.text,
        voice=request.voice,
        rate=request.rate,
        pitch=request.pitch,
        volume=request.volume,
    )

    if audio_data is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to synthesize speech"
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


@router.delete("/tts/cache")
async def tts_clear_cache():
    """Clear TTS cache."""
    count = await clear_cache()
    return {
        "status": "ok",
        "cleared": count,
    }
