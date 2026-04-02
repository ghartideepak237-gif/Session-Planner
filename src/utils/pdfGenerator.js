import jsPDF from 'jspdf';

// DESIGN TOKENS
const COLORS = {
  accent: [255, 122, 47],
  lightAccent: [255, 248, 242],
  textMain: [15, 23, 42],
  textSecondary: [51, 65, 85],
  textDim: [100, 116, 139],
  cardBorder: [226, 232, 240],
  cardBg: [255, 255, 255],
  divider: [226, 232, 240],
  headerBg: [248, 250, 252],
  tagBg: [241, 245, 249]
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
    let h = p + 25; // Start padding + Title space
    
    // Title
    doc.setFontSize(FONTS.title.size);
    const nameLines = doc.splitTextToSize(game.title, maxWidth);
    h += (nameLines.length * 16);
    h += 14; // Meta Row

    const sections = [
        { label: 'Activity Description:', text: game.description || game.rules },
        { label: 'Strategic Objective:', text: game.objective },
        { label: 'Context / When to use:', text: game.context },
        { label: 'Activity Notes:', text: game.notes },
        { label: 'Facilitator Notes:', text: game.facilitatorNotes }
    ].filter(s => s.text);

    sections.forEach(s => {
        h += 12; // Gap
        doc.setFontSize(FONTS.body.size);
        const textLines = doc.splitTextToSize(s.text, maxWidth);
        h += 15 + (textLines.length * 15); // Label + Text
    });
    return h + p;
};

const drawSessionNotes = (doc, notes, y, contentWidth) => {
    if (!notes) return y;
    const p = 15;
    const maxWidth = contentWidth - (p * 2) - 10;
    doc.setFontSize(FONTS.body.size);
    const lines = doc.splitTextToSize(notes, maxWidth);
    const h = (lines.length * 15) + (p * 2) + 20;

    doc.setFillColor(...COLORS.lightAccent);
    doc.roundedRect(MARGINS.x, y, contentWidth, h, 8, 8, 'F');
    
    doc.setFillColor(...COLORS.accent);
    doc.rect(MARGINS.x, y, 4, h, 'F');

    doc.setFontSize(FONTS.label.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text('SESSION NOTES (IMPORTANT FOR FACILITATOR)', MARGINS.x + 15, y + p + 5);
    
    doc.setFontSize(FONTS.body.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textMain);
    doc.text(lines, MARGINS.x + 15, y + p + 22);

    return y + h + 30;
};

// SHARED CARD RENDERER
const drawActivityCard = (doc, game, index, y, contentWidth, isNested = false, onPageBreak = null) => {
    const p = MARGINS.cardPadding;
    const maxWidth = contentWidth - (p * 2);
    const h = getActivityCardHeight(doc, game, contentWidth);
    const pageHeight = doc.internal.pageSize.getHeight();

    if (y + h > pageHeight - MARGINS.bottom) {
        doc.addPage();
        if (onPageBreak) onPageBreak();
        y = MARGINS.y + 30;
        addFooter(doc);
    }

    doc.setDrawColor(...COLORS.cardBorder);
    doc.setFillColor(...(isNested ? [255, 255, 255] : COLORS.cardBg));
    doc.setLineWidth(1);
    doc.roundedRect(isNested ? MARGINS.x + 10 : MARGINS.x, y, isNested ? contentWidth - 20 : contentWidth, h, 8, 8, 'FD');
    
    let textY = y + p + 10;
    const drawX = (isNested ? MARGINS.x + 10 : MARGINS.x) + p;
    
    doc.setFontSize(FONTS.title.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    const nameLines = doc.splitTextToSize(`${index + 1}. ${game.title}`, maxWidth);
    doc.text(nameLines, drawX, textY);
    textY += (nameLines.length * 16) + 4;
    
    doc.setFontSize(FONTS.meta.size);
    doc.setFont('helvetica', 'bold');
    const stageStr = (game.flowPosition || 'Activity').toUpperCase();
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(stageStr, drawX, textY);
    
    doc.setFont('helvetica', 'normal');
    const metaStr = `  |  ${game.category || 'General'}  |  ${game.actualDuration} min`;
    doc.setTextColor(...COLORS.textDim);
    doc.text(metaStr, drawX + doc.getTextWidth(stageStr), textY);
    textY += 18;
    
    const sections = [];
    if (game.description || game.rules) sections.push({ label: 'Activity Description:', text: game.description || game.rules });
    if (game.objective) sections.push({ label: 'Strategic Objective:', text: game.objective });
    if (game.context) sections.push({ label: 'Context / When to use:', text: game.context });
    if (game.notes) sections.push({ label: 'Activity Notes:', text: game.notes });
    if (game.facilitatorNotes) sections.push({ label: 'Facilitator Notes (Customized):', text: game.facilitatorNotes });

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
        const pageHeight = doc.internal.pageSize.getHeight();
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
        y += headerH + 20;

        // --- SESSION NOTES ---
        y = drawSessionNotes(doc, session.notes, y, contentWidth);

        // --- SESSION FLOW STRUCTURE (PEL MODEL) ---
        if (session.selectedGames && session.selectedGames.length > 0) {
            doc.setFontSize(FONTS.title.size);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.accent);
            doc.text('SESSION FLOW STRUCTURE', MARGINS.x, y);
            y += 20;
            
            doc.setFontSize(FONTS.body.size);
            const flowCategories = ['Quick Engage ⚡', 'Build Energy 🎯', 'Core Interaction 🧠', 'Tadka 🔥'];
            flowCategories.forEach(cat => {
                const gamesInCat = session.selectedGames.filter(g => g.flowPosition === cat);
                if (gamesInCat.length > 0) {
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...COLORS.textSecondary);
                    doc.text(`${cat}:`, MARGINS.x, y);
                    
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(...COLORS.textMain);
                    const names = gamesInCat.map(g => g.title).join(', ');
                    const limit = contentWidth - 140; // Indent padding
                    const lines = doc.splitTextToSize(names, limit);
                    
                    doc.text(lines, MARGINS.x + 130, y);
                    y += (lines.length * 15) + 6;
                }
            });
            y += 20;
        }

        // Check if drawing cards would cross page
        if (y > pageHeight - 100) {
            doc.addPage();
            y = MARGINS.y + 30; // Start below header
            addFooter(doc);
        }

        // --- ACTIVITY BREAKDOWN ---
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
            y += (objLines.length * 15) + 25;
        }

        // Program Level Session Notes
        if (program.notes) {
            y = drawSessionNotes(doc, program.notes, y, contentWidth);
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
            
            // Check for page break BEFORE starting a new week
            if (y > pageHeight - 150) { doc.addPage(); initializeHeader(); }

            // DRAW WEEK HEADER BLOCK (Instead of a giant card)
            doc.setDrawColor(...COLORS.cardBorder);
            doc.setFillColor(...COLORS.headerBg);
            doc.setLineWidth(1);
            doc.roundedRect(MARGINS.x, y, contentWidth, 45, 8, 8, 'FD');
            
            doc.setFontSize(FONTS.header.size);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.textMain);
            doc.text(`Week ${w}: ${wData.theme}`, MARGINS.x + 15, y + 28);
            y += 55;

            // Strategic Focus tags
            if (wData.focus) {
                doc.setFontSize(FONTS.meta.size);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...COLORS.textDim);
                doc.text("STRATEGIC FOCUS:", MARGINS.x, y);
                y += 12;
                const focusH = drawFocusTags(doc, wData.focus, MARGINS.x, y, contentWidth);
                y += focusH + 25;
            }

            // Sessions Loop
            weekSessions.forEach((session, sIdx) => {
                // Check if session header fits
                if (y > pageHeight - 100) { doc.addPage(); initializeHeader(); }

                const sW = contentWidth;
                if (session.selectedGames.length > 0) {
                    // Session Header Bar
                    doc.setDrawColor(...COLORS.cardBorder);
                    doc.setFillColor(...COLORS.cardBg);
                    doc.roundedRect(MARGINS.x, y, sW, 35, 6, 6, 'FD');
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...COLORS.textMain);
                    doc.text(`Session ${sIdx + 1}: ${session.programTheme || 'Facilitation'}`, MARGINS.x + 12, y + 22);
                    y += 45;

                    session.selectedGames.forEach((game, gIdx) => {
                        const res = drawActivityCard(doc, game, gIdx, y, sW, true, initializeHeader);
                        y = res.endY + 12;
                    });
                } else {
                    // Placeholder
                    doc.setDrawColor(209, 163, 175); 
                    doc.setLineDash([3, 3], 0);
                    doc.roundedRect(MARGINS.x, y, sW, 45, 6, 6, 'D');
                    doc.setLineDash([], 0);
                    doc.setFontSize(FONTS.sessionTitle.size);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(156, 163, 175);
                    doc.text(`Session ${sIdx + 1} (Not planned yet)`, MARGINS.x + 12, y + 28);
                    y += 60;
                }
                y += MARGINS.sessionGap;
            });

            y += 20; // Gap between weeks
            
            if (w < program.duration) {
                doc.setDrawColor(...COLORS.tagBg);
                doc.setLineWidth(2);
                doc.line(MARGINS.x, y - 10, MARGINS.x + contentWidth, y - 10);
            }
        }

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) { doc.setPage(i); addFooter(doc); }
        doc.save(`Roadmap_${program.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) { console.error('Program PDF Error', err); }
};
