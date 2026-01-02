"""
Toneo - Analyze Router
Text analysis endpoints.
"""
import logging
from fastapi import APIRouter, HTTPException, Request

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.tone_analyzer import get_analyzer
from app.core.rate_limit import limiter, ANALYZE_RATE_LIMIT

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit(ANALYZE_RATE_LIMIT)
async def analyze_text(request: Request, analyze_request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyze Chinese text and return tone information.

    - Segments text into words using jieba
    - Looks up tones in CC-CEDICT dictionary
    - Falls back to pypinyin if not in dictionary
    - Applies tone sandhi rules
    """
    try:
        analyzer = get_analyzer()
        result = analyzer.analyze_text(analyze_request.text)
        return result
    except Exception as e:
        # Log truncated text preview (max 20 chars) to avoid logging user content
        text_preview = analyze_request.text[:20] + "..." if len(analyze_request.text) > 20 else analyze_request.text
        logger.exception("Analysis failed (len=%d): %s", len(analyze_request.text), text_preview)
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please try again or contact support."
        )
