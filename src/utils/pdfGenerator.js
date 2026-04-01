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
  headerBg: [249, 250, 251]
};

const FONTS = {
  title: { size: 14, weight: 'bold' },
  body: { size: 11, weight: 'normal' },
  label: { size: 11, weight: 'bold' },
  meta: { size: 10, weight: 'normal' },
  footer: { size: 9, weight: 'normal' }
};

const MARGINS = {
  x: 40,
  y: 30,
  cardPadding: 14,
  sectionGap: 18
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
    const totalPages = doc.internal.getNumberOfPages();
    
    doc.setFontSize(FONTS.footer.size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textDim);
    
    // Left: Branding
    doc.text("Confidential – Positive Emotions Lab", MARGINS.x, pageHeight - 30);
    
    // Center: Page Numbering
    doc.text(String(pageCount), pageWidth / 2, pageHeight - 30, { align: 'center' });
    
    // Right: Tool Attribution
    const attribution = "Generated from Session Planner";
    doc.text(attribution, pageWidth - MARGINS.x - doc.getTextWidth(attribution), pageHeight - 30);
};

// SHARED CARD RENDERER
const drawActivityCard = (doc, game, index, y, contentWidth) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const p = MARGINS.cardPadding;
    const maxWidth = contentWidth - (p * 2);
    
    // 1. CALCULATE HEIGHT
    let h = p; 
    
    // Name
    doc.setFontSize(FONTS.title.size);
    doc.setFont('helvetica', 'bold');
    const nameLines = doc.splitTextToSize(`${index + 1}. ${game.title}`, maxWidth);
    h += (nameLines.length * 16) + 4;
    
    // Meta
    h += 14; 
    
    // Sections
    const sections = [];
    if (game.objective) sections.push({ label: 'Objective:', text: game.objective });
    if (game.context) sections.push({ label: 'Context:', text: game.context });
    
    const notes = game.notes || game.rules || game.description;
    if (notes) sections.push({ label: 'Notes:', text: notes });
    
    sections.forEach(s => {
        h += 12; // Gap before label
        doc.setFontSize(FONTS.body.size);
        const textLines = doc.splitTextToSize(s.text, maxWidth);
        h += 15 + (textLines.length * 15); // Label + Text
    });
    
    h += p; // Padding
    
    // 2. CHECK PAGE BREAK (Move entire card to next page)
    if (y + h > pageHeight - 60) {
        doc.addPage();
        y = 60; // Start after header area
    }
    
    // 3. RENDER CARD
    doc.setDrawColor(...COLORS.cardBorder);
    doc.setFillColor(...COLORS.cardBg);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGINS.x, y, contentWidth, h, 8, 8, 'FD');
    
    let textY = y + p + 10;
    
    // Draw Name
    doc.setFontSize(FONTS.title.size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.textMain);
    doc.text(nameLines, MARGINS.x + p, textY);
    textY += (nameLines.length * 16) + 4;
    
    // Draw Meta Row
    doc.setFontSize(FONTS.meta.size);
    doc.setFont('helvetica', 'normal');
    const metaStr = `${game.flowPosition} | ${game.category || game.theme_clean || 'Activity'} | ${game.actualDuration} min`;
    doc.setTextColor(...COLORS.textDim);
    doc.text(metaStr, MARGINS.x + p, textY);
    textY += 14;
    
    // Draw Sections
    sections.forEach(s => {
        textY += 12;
        doc.setFontSize(FONTS.body.size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(s.label, MARGINS.x + p, textY);
        
        textY += 15;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textMain);
        const textLines = doc.splitTextToSize(s.text, maxWidth);
        doc.text(textLines, MARGINS.x + p, textY);
        textY += (textLines.length * 15) - 6;
    });
    
    return { height: h, endY: y + h };
};

export const generateSessionPDF = async (session) => {
    try {
        const doc = new jsPDF({ format: 'a4', unit: 'pt' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - MARGINS.x * 2;
        let y = 50;
        
        const logoDataUrl = await getLogoDataUrl();

        // Logo
        if (logoDataUrl) {
            doc.addImage(logoDataUrl, 'PNG', MARGINS.x, y - 20, 24, 24);
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.accent);
        doc.text("Session Manual", pageWidth - MARGINS.x, y - 5, { align: 'right' });
        
        y += 20;

        // Session Header Card
        const headerPadding = 20;
        let headerH = headerPadding * 2 + 60;
        doc.setDrawColor(...COLORS.cardBorder);
        doc.setFillColor(...COLORS.headerBg);
        doc.roundedRect(MARGINS.x, y, contentWidth, headerH, 10, 10, 'FD');
        
        let headerY = y + headerPadding + 15;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textMain);
        doc.text(session.sessionNumber || 'Session Flow', MARGINS.x + 20, headerY);
        
        headerY += 22;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(`${session.programTheme || 'General Theme'} • ${session.college || 'Internal Project'}`, MARGINS.x + 20, headerY);
        
        headerY += 18;
        const totalDuration = session.selectedGames.reduce((acc, g) => acc + (g.actualDuration || 0), 0);
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textDim);
        doc.text(`Timeline: ${totalDuration} min planned / ${session.baseDuration} min target`, MARGINS.x + 20, headerY);
        
        y += headerH + MARGINS.sectionGap;

        // Activities
        session.selectedGames.forEach((game, index) => {
            const result = drawActivityCard(doc, game, index, y, contentWidth);
            y = result.endY + MARGINS.sectionGap;
        });

        // Footers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(doc);
        }

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
            doc.text("Program Manual", pageWidth - MARGINS.x, 35, { align: 'right' });
            y = 60;
        };

        // COVER PAGE
        if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', pageWidth/2 - 30, pageHeight/3 - 40, 60, 60);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.textMain);
        doc.text(program.name || 'Program Overview', pageWidth/2, pageHeight/3 + 50, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.textDim);
        doc.text(program.college || 'Consulting deliverable', pageWidth/2, pageHeight/3 + 75, { align: 'center' });
        doc.text("Professional Facilitation Playbook", pageWidth/2, pageHeight/2 + 50, { align: 'center' });
        
        // TOC & OBJECTIVES
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
        doc.text(`Duration: ${program.duration} Weeks | Format: ${program.totalSessions} Sessions`, MARGINS.x, y);
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

        // JOURNEY MAP
        if (program.duration > 0) {
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.accent);
            doc.text("Curriculum Roadmap", MARGINS.x, y);
            y += 25;
            
            const pillW = 75;
            const pillH = 22;
            const gap = 15;
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

        // WEEKS & ACTIVITIES
        for (let w = 1; w <= program.duration; w++) {
            const wData = program.weeks.find(item => item.week === w) || { theme: '', focus: '' };
            const weekSessions = sessionsList.filter(s => s.programWeek === w);
            
            if (y > pageHeight - 100) { doc.addPage(); initializeHeader(); }
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLORS.textMain);
            doc.text(`Week ${w}: ${wData.theme}`, MARGINS.x, y);
            y += 20;

            if (wData.focus) {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...COLORS.textSecondary);
                doc.text(`Strategic Focus: ${wData.focus}`, MARGINS.x, y);
                y += 25;
            }

            weekSessions.forEach(session => {
                if (y > pageHeight - 100) { doc.addPage(); initializeHeader(); }
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...COLORS.accent);
                doc.text(session.sessionNumber, MARGINS.x, y);
                y += 15;

                session.selectedGames.forEach((game, gIdx) => {
                    const result = drawActivityCard(doc, game, gIdx, y, contentWidth);
                    y = result.endY + 10;
                });
                y += 20;
            });
            y += 20;
        }

        // Final Footers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(doc);
        }

        doc.save(`Program_${program.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) { console.error('Program PDF Error', err); }
};
