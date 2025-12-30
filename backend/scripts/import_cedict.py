#!/usr/bin/env python3
"""
Toneo - CC-CEDICT Import Script
Downloads and imports CC-CEDICT dictionary into SQLite.

Usage:
    python scripts/import_cedict.py

Data source:
    https://www.mdbg.net/chinese/dictionary?page=cedict
    License: CC BY-SA 4.0
"""
import sqlite3
import re
import gzip
import csv
import urllib.request
from pathlib import Path
from typing import Optional


# CC-CEDICT download URL
CEDICT_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"

# Database path
DB_PATH = Path(__file__).parent.parent / "data" / "cedict.db"

# HSK 3.0 vocabulary (ivankra/hsk30 - clean CSV with pinyin, POS, levels 1-9)
HSK_DATA_URL = "https://raw.githubusercontent.com/ivankra/hsk30/master/hsk30.csv"


def download_cedict(force: bool = False) -> Path:
    """
    Download CC-CEDICT if not already present.

    Returns:
        Path to downloaded file
    """
    cache_dir = Path(__file__).parent.parent / "data" / "cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_file = cache_dir / "cedict.txt.gz"

    if cache_file.exists() and not force:
        print(f"Using cached CEDICT: {cache_file}")
        return cache_file

    print(f"Downloading CC-CEDICT from {CEDICT_URL}...")
    urllib.request.urlretrieve(CEDICT_URL, cache_file)
    print(f"Downloaded to {cache_file}")

    return cache_file


def parse_cedict_line(line: str) -> Optional[dict]:
    """
    Parse a single CC-CEDICT entry.

    Format: Traditional Simplified [pin1 yin1] /definition 1/definition 2/

    Returns:
        Dict with parsed fields, or None if not a valid entry
    """
    line = line.strip()

    # Skip comments and empty lines
    if not line or line.startswith("#"):
        return None

    # Match pattern: Traditional Simplified [pinyin] /definitions/
    match = re.match(
        r'^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.+)/$',
        line
    )

    if not match:
        return None

    traditional, simplified, pinyin_raw, definitions = match.groups()

    # Parse pinyin - extract tone numbers
    pinyin_parts = pinyin_raw.split()
    tones = []

    for part in pinyin_parts:
        # Extract tone number from end of syllable
        tone_match = re.search(r'(\d)$', part)
        if tone_match:
            tones.append(int(tone_match.group(1)))
        else:
            tones.append(5)  # Neutral tone

    return {
        "simplified": simplified,
        "traditional": traditional,
        "pinyin": pinyin_raw.lower(),  # Normalize to lowercase
        "tones": ",".join(str(t) for t in tones),
        "definitions": definitions.replace("/", "; "),
    }


def load_hsk_data() -> dict[str, int]:
    """
    Load HSK 3.0 vocabulary levels from ivankra/hsk30 CSV.

    CSV format: ID,Simplified,Traditional,Pinyin,POS,Level,WebNo,WebPinyin,OCR,Variants,CEDICT
    Level can be 1-6 or "7-9" for advanced.

    Returns:
        Dict mapping simplified characters to HSK level (1-9)
    """
    hsk_data = {}

    try:
        cache_dir = Path(__file__).parent.parent / "data" / "cache"
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = cache_dir / "hsk30.csv"

        if not cache_file.exists():
            print(f"Downloading HSK 3.0 data from {HSK_DATA_URL}...")
            urllib.request.urlretrieve(HSK_DATA_URL, cache_file)

        with open(cache_file, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader)  # Skip header

            for row in reader:
                if len(row) < 6:
                    continue

                # Columns: ID, Simplified, Traditional, Pinyin, POS, Level, ...
                simplified_raw = row[1]
                level_raw = row[5]

                # Handle variants like "爸爸|爸" - add both
                simplified_variants = simplified_raw.split("|")

                # Parse level: can be "1", "2", ..., "6", or "7-9"
                try:
                    if level_raw == "7-9":
                        level = 7  # Map advanced to 7
                    else:
                        level = int(level_raw)
                except ValueError:
                    continue

                if 1 <= level <= 9:
                    for word in simplified_variants:
                        word = word.strip()
                        if word and word not in hsk_data:
                            hsk_data[word] = level

        print(f"Loaded {len(hsk_data)} HSK 3.0 entries")

    except Exception as e:
        print(f"Warning: Could not load HSK data: {e}")

    return hsk_data


def create_database():
    """Create SQLite database with schema."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            simplified TEXT NOT NULL,
            traditional TEXT,
            pinyin TEXT NOT NULL,
            tones TEXT NOT NULL,
            definitions TEXT,
            hsk_level INTEGER DEFAULT 0,
            frequency INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_simplified ON entries(simplified)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_pinyin ON entries(pinyin)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hsk ON entries(hsk_level)")

    conn.commit()
    return conn


def import_cedict(force: bool = False):
    """
    Main import function.

    Args:
        force: Re-download and re-import even if data exists
    """
    print("=" * 60)
    print("Toneo - CC-CEDICT Import")
    print("=" * 60)

    # Check if already imported
    if DB_PATH.exists() and not force:
        conn = sqlite3.connect(DB_PATH)
        count = conn.execute("SELECT COUNT(*) FROM entries").fetchone()[0]
        if count > 0:
            print(f"Database already contains {count} entries.")
            print(f"Use --force to re-import.")
            return

    # Download CEDICT
    cedict_file = download_cedict(force)

    # Load HSK data
    hsk_data = load_hsk_data()

    # Create database
    print(f"Creating database at {DB_PATH}...")
    conn = create_database()
    cursor = conn.cursor()

    # Clear existing data if re-importing
    if force:
        cursor.execute("DELETE FROM entries")
        conn.commit()

    # Parse and import
    print("Parsing CC-CEDICT...")
    entries = []
    line_count = 0
    error_count = 0

    with gzip.open(cedict_file, "rt", encoding="utf-8") as f:
        for line in f:
            line_count += 1

            entry = parse_cedict_line(line)
            if entry is None:
                continue

            # Add HSK level
            hsk_level = hsk_data.get(entry["simplified"], 0)

            entries.append((
                entry["simplified"],
                entry["traditional"],
                entry["pinyin"],
                entry["tones"],
                entry["definitions"],
                hsk_level,
                0,  # frequency (placeholder)
            ))

            # Batch insert every 10000 entries
            if len(entries) >= 10000:
                cursor.executemany(
                    """INSERT INTO entries
                       (simplified, traditional, pinyin, tones, definitions, hsk_level, frequency)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    entries
                )
                conn.commit()
                print(f"  Imported {line_count} lines...")
                entries = []

    # Insert remaining entries
    if entries:
        cursor.executemany(
            """INSERT INTO entries
               (simplified, traditional, pinyin, tones, definitions, hsk_level, frequency)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            entries
        )
        conn.commit()

    # Get final count
    count = cursor.execute("SELECT COUNT(*) FROM entries").fetchone()[0]
    hsk_count = cursor.execute("SELECT COUNT(*) FROM entries WHERE hsk_level > 0").fetchone()[0]

    conn.close()

    print("=" * 60)
    print(f"Import complete!")
    print(f"  Total entries: {count:,}")
    print(f"  With HSK level: {hsk_count:,}")
    print(f"  Database: {DB_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    import sys

    force = "--force" in sys.argv
    import_cedict(force)
