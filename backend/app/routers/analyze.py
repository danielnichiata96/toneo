"""
Toneo - Analyze Router
Text analysis endpoints.
"""
from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.tone_analyzer import get_analyzer


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
        raise HTTPException(status_code=500, detail=str(e))
