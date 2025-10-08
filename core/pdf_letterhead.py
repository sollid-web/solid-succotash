"""Reusable PDF letterhead builder.

Implements a frame-based Platypus layout that draws a corporate letterhead
on every page via an onPage callback, while body content flows naturally
across pages. No external dependencies beyond reportlab (already assumed
available in environment). No HTML->PDF libs are introduced here.

Usage:
    from core.pdf_letterhead import build_pdf
    build_pdf("/tmp/agreement.pdf", ["Paragraph 1", "Paragraph 2"])  

This will create a PDF with the WolvCapital letterhead on each page and
the provided paragraphs styled for readability.
"""

from __future__ import annotations

from typing import List

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Frame,
    PageTemplate,
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics

# Register a Unicode font (ReportLab core CID font for broad glyph coverage)
pdfmetrics.registerFont(UnicodeCIDFont("HeiseiKakuGo-W5"))

PAGE_WIDTH, PAGE_HEIGHT = A4


def _draw_letterhead(canvas: Canvas, doc):  # pragma: no cover - drawing side effect
    """Draw header & footer decorations on each page.

    Keeps drawing logic isolated; invoked automatically by PageTemplate.
    """
    # Header emblem / brand mark
    canvas.setFont("HeiseiKakuGo-W5", 70)
    canvas.setFillColorRGB(1, 0.843, 0)  # Gold W highlight
    canvas.drawString(50, PAGE_HEIGHT - 120, "W")

    # Accent bars
    canvas.setFillColorRGB(0.129, 0.588, 0.953)  # Primary blue
    canvas.rect(45, PAGE_HEIGHT - 140, 80, 8, fill=1, stroke=0)
    canvas.setFillColorRGB(0.431, 0.757, 0.894)  # Light accent
    canvas.rect(40, PAGE_HEIGHT - 155, 100, 6, fill=1, stroke=0)

    # Wordmark & tagline
    canvas.setFont("HeiseiKakuGo-W5", 40)
    canvas.setFillColorRGB(0.051, 0.278, 0.631)  # Deep brand color
    canvas.drawString(180, PAGE_HEIGHT - 100, "WOLVCAPITAL")
    canvas.setFont("HeiseiKakuGo-W5", 28)
    canvas.setFillColorRGB(0.129, 0.588, 0.953)
    canvas.drawString(180, PAGE_HEIGHT - 130, "INVEST")

    # Header rule
    canvas.setStrokeColorRGB(0.431, 0.757, 0.894)
    canvas.setLineWidth(2)
    canvas.line(50, PAGE_HEIGHT - 170, PAGE_WIDTH - 50, PAGE_HEIGHT - 170)

    # Footer bar / contact line
    canvas.setFillColorRGB(0.129, 0.588, 0.953)
    canvas.rect(0, 0, PAGE_WIDTH, 60, fill=1, stroke=0)
    canvas.setFont("HeiseiKakuGo-W5", 12)
    canvas.setFillColorRGB(1, 1, 1)
    canvas.drawCentredString(
        PAGE_WIDTH / 2,
        25,
        "WolvCapital Invest · www.wolv-invest.io · support@wolv-invest",
    )


def build_pdf(path: str, paragraphs: List[str]):
    """Build a PDF at `path` containing the given paragraphs.

    A top/bottom margin reserve the letterhead area (header ~170px, footer ~60px).
    Content flows inside a Frame so multi-page documents get consistent
    chrome on every page.
    """

    # Content safe area (coordinates derived from original specification)
    top, bottom, left, right = 180, 80, 40, 40
    frame = Frame(
        left,
        bottom,
        PAGE_WIDTH - left - right,
        PAGE_HEIGHT - top - bottom,
        showBoundary=0,
    )

    styles = getSampleStyleSheet()
    # Body style (override Normal subtly for readability)
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontName="HeiseiKakuGo-W5",
            fontSize=11,
            leading=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1",
            parent=styles["Heading1"],
            fontName="HeiseiKakuGo-W5",
            fontSize=18,
            leading=22,
            spaceAfter=10,
        )
    )

    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=left,
        rightMargin=right,
        topMargin=top,
        bottomMargin=bottom,
    )
    doc.addPageTemplates(
        [PageTemplate(id="Letterhead", frames=[frame], onPage=_draw_letterhead)]
    )

    story = [Paragraph("Service Agreement", styles["H1"])]
    for p in paragraphs:
        story.append(Paragraph(p, styles["Body"]))
        story.append(Spacer(1, 8))

    doc.build(story)


__all__ = ["build_pdf"]
