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
    doc.text("Confidential – Positive Emotions Lab", MARGINS.x, pageHeight - 30);
    doc.text(String(pageCount), pageWidth / 2, pageHeight - 30, { align: 'center' });
    const attr = "Generated from Session Planner";
    doc.text(attr, pageWidth - MARGINS.x - doc.getTextWidth(attr), pageHeight - 30);
};

// SHARED CARD RENDERER (Used in Individual Session PDF)
const drawActivityCard = (doc, game, index, y, contentWidth, isNested = false) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const p = MARGINS.cardPadding;
    const maxWidth = contentWidth - (p * 2);
    
    // Calculate Height
    let h = p; 
    doc.setFontSize(FONTS.title.size);
    doc.setFont('helvetica', 'bold');
    const nameLines = doc.splitTextToSize(`${index + 1}. ${game.title}`, maxWidth);
    h += (nameLines.length * 16) + 4;
    h += 14; // Meta

    const sections = [];
    if (game.objective) sections.push({ label: 'Objective:', text: game.objective });
    if (game.context) sections.push({ label: 'Context:', text: game.context });
    const notes = game.notes || game.rules || game.description;
    if (notes) sections.push({ label: 'Notes:', text: notes });
    
    sections.forEach(s => {
        h += 12;
        doc.setFontSize(FONTS.body.size);
        const textLines = doc.splitTextToSize(s.text, maxWidth);
        h += 15 + (textLines.length * 15);
    });
    h += p; 

    if (!isNested && y + h > pageHeight - 60) {
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
    doc.text(nameLines, drawX, textY);
    textY += (nameLines.length * 16) + 4;
    
    doc.setFontSize(FONTS.meta.size);
    doc.setFont('helvetica', 'normal');
    const metaStr = `${game.flowPosition} | ${game.category || game.theme_clean || 'Activity'} | ${game.actualDuration} min`;
    doc.setTextColor(...COLORS.textDim);
    doc.text(metaStr, drawX, textY);
    textY += 14;
    
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

// FOCUS TAGS RENDERER
const drawFocusTags = (doc, focusString, x, y, maxWidth) => {
    if (!focusString) return 0;
    const tags = focusString.split(/[,\n]/).map(t => t.trim()).filter(Boolean);
    if (tags.length === 0) return 0;

    let currentX = x;
    let currentY = y;
    const tagPaddingX = 10;
    const tagPaddingY = 6;
    const rowHeight = 28;
    let totalHeight = rowHeight;

    doc.setFontSize(FONTS.tag.size);
    doc.setFont('helvetica', 'normal');

    tags.forEach(tag => {
        const textWidth = doc.getTextWidth(tag);
        const tagW = textWidth + tagPaddingX * 2;
        
        if (currentX + tagW > x + maxWidth) {
            currentX = x;
            currentY += rowHeight;
            totalHeight += rowHeight;
        }

        doc.setFillColor(...COLORS.tagBg);
        doc.roundedRect(currentX, currentY, tagW, 20, 6, 6, 'F');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(tag, currentX + tagPaddingX, currentY + 13);
        
        currentX += tagW + 8;
    });

    return totalHeight;
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
            
            // HEIGHT CALCULATION (To keep week on one page where possible)
            let wH = 18 + 40; // Card Padding + Header
            if (wData.focus) wH += 40; // Approx Focus area
            weekSessions.forEach(s => {
                if (s.selectedGames.length > 0) {
                    wH += 30; // Session info
                    s.selectedGames.forEach(() => { wH += 120; }); // Shared activity card approx
                } else { wH += 50; } // Placeholder
                wH += MARGINS.sessionGap;
            });
            wH += 18; // Bottom Padding

            if (y + wH > pageHeight - 80) { doc.addPage(); initializeHeader(); }

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
                innerY += focusH + 10;
            }

            // Sessions
            weekSessions.forEach((session, sIdx) => {
                const sX = MARGINS.x + 10;
                const sW = contentWidth - 20;
                
                if (session.selectedGames.length > 0) {
                    // Session Card
                    doc.setDrawColor(...COLORS.cardBorder);
                    doc.setFillColor(...COLORS.cardBg);
                    doc.roundedRect(sX, innerY, sW, 30, 8, 8, 'FD'); // Initial title bar
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...COLORS.textMain);
                    doc.text(`Session ${sIdx + 1}: ${session.programTheme || 'Facilitation'}`, sX + 12, innerY + 20);
                    innerY += 35;

                    session.selectedGames.forEach((game, gIdx) => {
                        const res = drawActivityCard(doc, game, gIdx, innerY, sW, true);
                        innerY = res.endY + 10;
                    });
                } else {
                    // Placeholder
                    doc.setDrawColor(209, 163, 175); // #9CA3AF approx for dash
                    doc.setLineDash([3, 3], 0);
                    doc.roundedRect(sX, innerY, sW, 40, 8, 8, 'D');
                    doc.setLineDash([], 0);
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(156, 163, 175);
                    doc.text(`Session ${sIdx + 1} (Not planned yet)`, sX + 12, innerY + 25);
                    innerY += 50;
                }
                innerY += MARGINS.sessionGap;
            });

            // Update Y
            y += wH + 26;
            
            // Visual Divider between weeks (if not at end)
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
