"""
Toneo - Analyze Router
Text analysis endpoints.
"""
import logging
from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.tone_analyzer import get_analyzer

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyze Chinese text and return tone information.

    - Segments text into words using jieba
    - Looks up tones in CC-CEDICT dictionary
    - Falls back to pypinyin if not in dictionary
    - Applies tone sandhi rules
    """
    try:
        analyzer = get_analyzer()
        result = analyzer.analyze_text(request.text)
        return result
    except Exception as e:
        # Log full error server-side, return generic message to client
        logger.exception("Analysis failed for text: %s...", request.text[:50])
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please try again or contact support."
        )
