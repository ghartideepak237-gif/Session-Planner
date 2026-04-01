import jsPDF from 'jspdf';

// DESIGN TOKENS
const COLORS = {
  accent: [255, 107, 53],
  textMain: [20, 20, 20],
  textSecondary: [55, 65, 81],
  textDim: [107, 114, 128],
  cardBorder: [229, 231, 235],
  cardBg: [250, 250, 250],
  divider: [229, 231, 235],
  headerBg: [249, 250, 251],
  tagBg: [243, 244, 246]
};

const FONTS = {
  header: { size: 16, weight: 'bold' },
  title: { size: 14, weight: 'bold' },
  sessionTitle: { size: 13, weight: 'bold' },
  body: { size: 11, weight: 'normal' },
  label: { size: 11, weight: 'bold' },
  tag: { size: 10, weight: 'normal' },
  meta: { size: 10, weight: 'normal' },
  footer: { size: 9, weight: 'normal' }
};

const MARGINS = {
  x: 40,
  y: 30,
  bottom: 40, // SAFE FOOTER ZONE
  cardPadding: 16,
  sectionGap: 24,
  sessionGap: 14
};

// HELPERS
const getLogoDataUrl = async () => {
    try {
        const response = await fetch('/e-logo.png');
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) { return null; }
};

const addFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageCount = doc.internal.getCurrentPageInfo().pageNumber;
    
    doc.setFontSize(FONTS.footer.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textDim);
    
    // Bottom Safe Line
    doc.text("Confidential – Positive Emotions Lab", MARGINS.x, pageHeight - 25);
    doc.text(String(pageCount), pageWidth / 2, pageHeight - 25, { align: 'center' });
    const attr = "Generated from Session Planner";
    doc.text(attr, pageWidth - MARGINS.x - doc.getTextWidth(attr), pageHeight - 25);
};

// ATOMIC HEIGHT CALCULATORS
const getActivityCardHeight = (doc, game, contentWidth) => {
    const p = MARGINS.cardPadding;
    const maxWidth = contentWidth - (p * 2);
    let h = p; 
    
    doc.setFontSize(FONTS.title.size);
    const nameLines = doc.splitTextToSize(game.title, maxWidth);
    h += (nameLines.length * 16) + 4;
    h += 14; // Meta Row

    const sections = [game.objective, game.context, game.notes || game.rules || game.description].filter(Boolean);
    sections.forEach(text => {
        h += 12; // Label Gap
        doc.setFontSize(FONTS.body.size);
        const textLines = doc.splitTextToSize(text, maxWidth);
        h += 15 + (textLines.length * 15); // Label + Text
    });
    return h + p;
};

// SHARED CARD RENDERER
const drawActivityCard = (doc, game, index, y, contentWidth, isNested = false) => {
    const p = MARGINS.cardPadding;
    const maxWidth = contentWidth - (p * 2);
    const h = getActivityCardHeight(doc, game, contentWidth);
    const pageHeight = doc.internal.pageSize.getHeight();

    // Atomic Page Break
    if (!isNested && y + h > pageHeight - MARGINS.bottom) {
        doc.addPage();
        y = 60;
    }

    doc.setDrawColor(...COLORS.cardBorder);
    doc.setFillColor(...(isNested ? [255, 255, 255] : COLORS.cardBg));
    doc.setLineWidth(0.5);
    doc.roundedRect(isNested ? MARGINS.x + 10 : MARGINS.x, y, isNested ? contentWidth - 20 : contentWidth, h, 8, 8, 'FD');
    
    let textY = y + p + 10;
    const drawX = (isNested ? MARGINS.x + 10 : MARGINS.x) + p;

    doc.setFontSize(FONTS.title.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.textMain);
    const nameLines = doc.splitTextToSize(`${index + 1}. ${game.title}`, maxWidth);
    doc.text(nameLines, drawX, textY);
    textY += (nameLines.length * 16) + 4;
    
    doc.setFontSize(FONTS.meta.size);
    doc.setFont('helvetica', 'normal');
    const metaStr = `${game.flowPosition} | ${game.category || game.theme_clean || 'Activity'} | ${game.actualDuration} min`;
    doc.setTextColor(...COLORS.textDim);
    doc.text(metaStr, drawX, textY);
    textY += 14;
    
    const sections = [];
    if (game.objective) sections.push({ label: 'Objective:', text: game.objective });
    if (game.context) sections.push({ label: 'Context:', text: game.context });
    const notes = game.notes || game.rules || game.description;
    if (notes) sections.push({ label: 'Notes:', text: notes });

    sections.forEach(s => {
        textY += 12;
        doc.setFontSize(FONTS.body.size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(s.label, drawX, textY);
        textY += 15;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textMain);
        const textLines = doc.splitTextToSize(s.text, maxWidth - (isNested ? 20 : 0));
        doc.text(textLines, drawX, textY);
        textY += (textLines.length * 15) - 6;
    });
    
    return { height: h, endY: y + h };
};

// FOCUS TAGS RENDERER (Grid Layout 2-column force)
// FOCUS TAGS RENDERER (Grid Layout 2-column force)
const drawFocusTags = (doc, focusString, x, y, maxWidth) => {
    if (!focusString) return 0;
    // Aggressively split by bullets, commas, or newlines
    const tags = focusString
        .split(/[•\-\*\n,]/)
        .map(t => t.trim()) 
        .filter(Boolean);
    
    if (tags.length === 0) return 0;

    const colW = (maxWidth / 2) - 12;
    const tagPaddingX = 10;
    const tagPaddingY = 8;
    
    let currentX = x;
    let currentY = y;
    let maxRowH = 0;
    let totalH = 0;

    doc.setFontSize(FONTS.tag.size);
    doc.setFont('helvetica', 'normal');

    tags.forEach((tag, idx) => {
        const textLines = doc.splitTextToSize(tag, colW - (tagPaddingX * 2));
        const tagH = (textLines.length * 13) + (tagPaddingY * 2);
        
        if (idx > 0 && idx % 2 === 0) {
            currentX = x;
            currentY += maxRowH + 10;
            totalH += maxRowH + 10;
            maxRowH = 0;
        }

        // Draw Tag Background (slightly darker for visibility)
        doc.setFillColor(235, 237, 240); 
        doc.roundedRect(currentX, currentY, colW, tagH, 6, 6, 'F');
        
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(textLines, currentX + tagPaddingX, currentY + tagPaddingY + 10);
        
        maxRowH = Math.max(maxRowH, tagH);
        currentX += colW + 15;
    });

    return totalH + maxRowH;
};

// MAIN EXPORTS
export const generateSessionPDF = async (session) => {
    try {
        const doc = new jsPDF({ format: 'a4', unit: 'pt' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - MARGINS.x * 2;
        let y = 50;
        const logoDataUrl = await getLogoDataUrl();

        if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', MARGINS.x, y - 20, 24, 24);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.accent);
        doc.text("Session Manual", pageWidth - MARGINS.x, y - 5, { align: 'right' });
        y += 20;

        const headerH = 100;
        doc.setDrawColor(...COLORS.cardBorder);
        doc.setFillColor(...COLORS.headerBg);
        doc.roundedRect(MARGINS.x, y, contentWidth, headerH, 10, 10, 'FD');
        
        let hY = y + 35;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textMain);
        doc.text(session.sessionNumber || 'Session Flow', MARGINS.x + 20, hY);
        hY += 22;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(`${session.programTheme || 'General Theme'} • ${session.college || 'Internal Project'}`, MARGINS.x + 20, hY);
        hY += 18;
        const totalDuration = session.selectedGames.reduce((acc, g) => acc + (g.actualDuration || 0), 0);
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textDim);
        doc.text(`Timeline: ${totalDuration} min planned / ${session.baseDuration} min target`, MARGINS.x + 20, hY);
        y += headerH + MARGINS.sectionGap;

        session.selectedGames.forEach((game, index) => {
            const result = drawActivityCard(doc, game, index, y, contentWidth);
            y = result.endY + MARGINS.sectionGap;
        });

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) { doc.setPage(i); addFooter(doc); }
        doc.save(`Session_${session.sessionNumber.replace(/\s+/g, '_')}.pdf`);
    } catch (err) { console.error('Session PDF Error', err); }
};

export const generateProgramPDF = async (program, sessionsList) => {
    try {
        const doc = new jsPDF({ format: 'a4', unit: 'pt' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - MARGINS.x * 2;
        let y = 60;
        const logoDataUrl = await getLogoDataUrl();

        const initializeHeader = () => {
            if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', MARGINS.x, 20, 24, 24);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.textDim);
            doc.text("Program Curriculum", pageWidth - MARGINS.x, 35, { align: 'right' });
            y = 60;
        };

        // 1. COVER PAGE
        if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', pageWidth/2 - 30, pageHeight/3 - 40, 60, 60);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textMain);
        doc.text(program.name || 'Program Overview', pageWidth/2, pageHeight/3 + 50, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textDim);
        doc.text(program.college || 'Workshop Curriculum Guide', pageWidth/2, pageHeight/3 + 75, { align: 'center' });
        doc.text("Professional Facilitation Playbook", pageWidth/2, pageHeight/2 + 50, { align: 'center' });
        
        // 2. OVERVIEW PAGE
        doc.addPage();
        initializeHeader();
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textMain);
        doc.text("Program Architecture", MARGINS.x, y);
        y += 25;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(`Timeline: ${program.duration} Weeks | Format: ${program.totalSessions} Sessions`, MARGINS.x, y);
        y += 35;

        if (program.objective) {
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.accent);
            doc.text("Strategic Objectives", MARGINS.x, y);
            y += 18;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...COLORS.textMain);
            const objLines = doc.splitTextToSize(program.objective, contentWidth);
            doc.text(objLines, MARGINS.x, y);
            y += (objLines.length * 15) + 40;
        }

        if (program.duration > 0) {
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.accent);
            doc.text("Curriculum Roadmap", MARGINS.x, y);
            y += 25;
            const pillW = 75; const pillH = 22; const gap = 15;
            const itemsPerRow = Math.floor(contentWidth / (pillW + gap));
            for (let w = 1; w <= program.duration; w++) {
                const col = (w - 1) % itemsPerRow;
                const row = Math.floor((w - 1) / itemsPerRow);
                const xPos = MARGINS.x + col * (pillW + gap);
                const currentY = y + row * (pillH + 10);
                doc.setFillColor(...COLORS.accent);
                doc.roundedRect(xPos, currentY, pillW, pillH, 11, 11, 'F');
                doc.setFontSize(9);
                doc.setTextColor(255, 255, 255);
                doc.text(`Week ${w}`, xPos + pillW/2, currentY + 14, { align: 'center' });
                if (w === program.duration) y = currentY + pillH + 40;
            }
        }

        // 3. WEEKLY CURRICULUM
        for (let w = 1; w <= program.duration; w++) {
            const wData = program.weeks.find(item => item.week === w) || { theme: '', focus: '' };
            const weekSessions = sessionsList.filter(s => s.programWeek === w);
            
            // ATOMIC HEIGHT CALCULATION
            let wH = 18 + 40; // Card Padding + Header
            if (wData.focus) {
                const tags = wData.focus.split(/[,\n]/).map(t => t.trim()).filter(Boolean);
                const rows = Math.ceil(tags.length / 2);
                wH += 30 + (rows * 36); // STRATEGIC FOCUS label + Tags
            }
            weekSessions.forEach(s => {
                if (s.selectedGames.length > 0) {
                    wH += 45; // Session title card + gap
                    s.selectedGames.forEach(g => { 
                        wH += getActivityCardHeight(doc, g, contentWidth - 20) + 12; 
                    });
                } else { wH += 60; } // Placeholder + gap
                wH += MARGINS.sessionGap;
            });
            wH += 25; // Bottom Padding + Visual Buffer
            wH += 25; // EXTRA SAFETY BUFFER FOR FOOTER PROTECTION

            if (y + wH > pageHeight - MARGINS.bottom) { doc.addPage(); initializeHeader(); }

            // DRAW WEEK CARD
            doc.setDrawColor(...COLORS.cardBorder);
            doc.setFillColor(255, 255, 255);
            doc.setLineWidth(1);
            doc.roundedRect(MARGINS.x, y, contentWidth, wH, 12, 12, 'FD');

            // Week Header
            doc.setFillColor(...COLORS.headerBg);
            doc.roundedRect(MARGINS.x + 8, y + 8, contentWidth - 16, 42, 8, 8, 'F');
            doc.setFontSize(FONTS.header.size);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.textMain);
            doc.text(`Week ${w}: ${wData.theme}`, MARGINS.x + 18, y + 34);

            let innerY = y + 60;

            // Focus Area Tags
            if (wData.focus) {
                innerY += 10;
                doc.setFontSize(FONTS.meta.size);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...COLORS.textDim);
                doc.text("STRATEGIC FOCUS:", MARGINS.x + 18, innerY);
                innerY += 8;
                const focusH = drawFocusTags(doc, wData.focus, MARGINS.x + 18, innerY, contentWidth - 36);
                innerY += focusH + 15;
            }

            // Sessions
            weekSessions.forEach((session, sIdx) => {
                const sX = MARGINS.x + 10;
                const sW = contentWidth - 20;
                
                if (session.selectedGames.length > 0) {
                    doc.setDrawColor(...COLORS.cardBorder);
                    doc.setFillColor(...COLORS.cardBg);
                    doc.roundedRect(sX, innerY, sW, 35, 8, 8, 'FD');
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...COLORS.textMain);
                    doc.text(`Session ${sIdx + 1}: ${session.programTheme || 'Facilitation'}`, sX + 12, innerY + 22);
                    innerY += 45;

                    session.selectedGames.forEach((game, gIdx) => {
                        const res = drawActivityCard(doc, game, gIdx, innerY, sW, true);
                        innerY = res.endY + 12;
                    });
                } else {
                    doc.setDrawColor(209, 163, 175); 
                    doc.setLineDash([3, 3], 0);
                    doc.roundedRect(sX, innerY, sW, 45, 8, 8, 'D');
                    doc.setLineDash([], 0);
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(156, 163, 175);
                    doc.text(`Session ${sIdx + 1} (Not planned yet)`, sX + 12, innerY + 28);
                    innerY += 60;
                }
                innerY += MARGINS.sessionGap;
            });

            y += wH + 26;
            
            if (w < program.duration) {
                doc.setDrawColor(...COLORS.tagBg);
                doc.setLineWidth(2);
                doc.line(MARGINS.x, y - 13, MARGINS.x + contentWidth, y - 13);
            }
        }

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) { doc.setPage(i); addFooter(doc); }
        doc.save(`Roadmap_${program.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) { console.error('Program PDF Error', err); }
};
