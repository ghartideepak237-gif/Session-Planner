import jsPDF from 'jspdf';

export const generateSessionPDF = (session) => {
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    let y = 20;
    const margin = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 53); // Accent color
    doc.text('Facilitation Flow', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${session.college || 'General'} | Session: ${session.sessionNumber || 'N/A'}`, margin, y);
    y += 6;
    
    const totalDuration = session.selectedGames.reduce((acc, g) => acc + g.actualDuration, 0);
    doc.text(`Target: ${session.baseDuration} min | Planned: ${totalDuration} min`, margin, y);
    y += 10;
    
    // Notes block if exists
    if (session.notes) {
       doc.setFontSize(10);
       doc.setTextColor(80, 80, 80);
       doc.setFont('helvetica', 'italic');
       const splitNotes = doc.splitTextToSize(`Notes: ${session.notes}`, 170);
       doc.text(splitNotes, margin, y);
       y += (splitNotes.length * 5) + 5;
    }

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 190, y);
    y += 10;

    // Games Iteration
    session.selectedGames.forEach((game, index) => {
      // Check for page break
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // Game Title & Duration
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(`${index + 1}. ${game.title} - ${game.actualDuration} min`, margin, y);
      y += 6;

      // Type / Objective / Flow
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(150, 150, 150);
      doc.text(`Flow: ${game.flowPosition} | Energy: ${game.energyType} | Engagement: ${game.engagementType}`, margin, y);
      y += 7;

      // Instructions
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const splitRules = doc.splitTextToSize(game.rules || game.description || 'No rules provided.', 170);
      doc.text(splitRules, margin, y);
      y += (splitRules.length * 5) + 8;
    });

    doc.save(`Session_${session.sessionNumber || 'Plan'}.pdf`);
  } catch (err) {
    console.error('Failed to generate PDF', err);
    alert('Error generating PDF. Check console.');
  }
};

const getLogoDataUrl = async () => {
    try {
        const response = await fetch('/e-logo.png');
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return null;
    }
};

export const generateProgramPDF = async (program, sessionsList) => {
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'pt' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;
    
    const logoDataUrl = await getLogoDataUrl();
    const accentColor = [255, 122, 47];
    const textColor = [20, 20, 20];
    const secondaryColor = [100, 100, 100];
    const cardBg = [248, 248, 250];

    const addHeaderAndWatermark = (pageNumber) => {
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(245, 245, 245);
        doc.text("e-Socialize Program Tool", pageWidth/2, pageHeight/2, { align: 'center', angle: -45 });

        if (logoDataUrl) {
            doc.addImage(logoDataUrl, 'PNG', margin, 20, 28, 28);
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text("Session Planner", pageWidth - margin, 32, { align: 'right' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...secondaryColor);
        doc.text("e-Socialize Program Tool", pageWidth - margin, 44, { align: 'right' });
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, 54, pageWidth - margin, 54);
        
        y = 80;
    };

    const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - 60) {
            doc.addPage();
            addHeaderAndWatermark(doc.internal.getCurrentPageInfo().pageNumber);
        }
    };

    // PAGE 1: COVER PAGE
    if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', pageWidth/2 - 30, pageHeight/3 - 40, 60, 60);
    }
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(program.name || 'Program Roadmap', pageWidth/2, pageHeight/3 + 50, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(program.college || 'General Institution', pageWidth/2, pageHeight/3 + 75, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text("Prepared by Positive Emotions Lab", pageWidth/2, pageHeight/2 + 50, { align: 'center' });
    
    const dateOpts = { month: 'long', year: 'numeric' };
    doc.text(new Date().toLocaleDateString('en-US', dateOpts), pageWidth/2, pageHeight/2 + 70, { align: 'center' });

    // PAGE 2: PROGRAM INFO & OBJECTIVES
    doc.addPage();
    addHeaderAndWatermark(2);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(program.name || 'Program Overview', margin, y);
    y += 20;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(`${program.college || 'General'} | Duration: ${program.duration} Weeks | ${program.totalSessions} Sessions`, margin, y);
    y += 20;
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    if (program.objective) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...accentColor);
        doc.text("Program Objectives", margin, y);
        y += 15;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        const objLines = doc.splitTextToSize(program.objective, contentWidth);
        doc.text(objLines, margin, y);
        y += (objLines.length * 15) + 30;
    }

    if (program.duration > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentColor);
      doc.text("Program Journey", margin, y);
      y += 20;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      
      const maxPillsPerRow = 6;
      const pillMargin = 10;
      const availableWidth = contentWidth - (Math.min(program.duration, maxPillsPerRow) - 1) * pillMargin;
      const journeyWidth = Math.min(availableWidth / Math.min(program.duration, maxPillsPerRow), 100);
      
      for (let w = 1; w <= program.duration; w++) {
          const wIndex = w - 1;
          const row = Math.floor(wIndex / maxPillsPerRow);
          const col = wIndex % maxPillsPerRow;
          
          if (col === 0 && row > 0) {
             y += 40;
          }
          
          const xPos = margin + col * (journeyWidth + pillMargin);
          const nextX = margin + (col + 1) * (journeyWidth + pillMargin) - pillMargin;
          
          doc.setFillColor(...accentColor);
          doc.roundedRect(xPos, y, journeyWidth, 24, 12, 12, 'F');
          
          const textStr = program.duration > 8 ? `W${w}` : `Week ${w}`;
          doc.text(textStr, xPos + journeyWidth/2, y + 16, { align: 'center' });
          
          if (w < program.duration && col < maxPillsPerRow - 1) {
              doc.setFillColor(...secondaryColor);
              doc.triangle(nextX + 2, y + 8, nextX + 2, y + 16, nextX + 8, y + 12, 'F');
          }
      }
      y += 60;
    }

    checkPageBreak(50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...secondaryColor);
    doc.text("Note: Each session is 45 minutes in duration.", margin, y);
    y += 30;

    const weeklyMap = {};
    for (let w = 1; w <= program.duration; w++) {
      weeklyMap[w] = sessionsList.filter(s => s.programWeek === w);
    }
    
    Object.entries(weeklyMap).forEach(([week, weekSessions]) => {
      const wData = program.weeks.find(wItem => wItem.week === parseInt(week)) || { theme: '', focus: '' };
      
      checkPageBreak(120);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text(`Week ${week} — ${wData.theme}`, margin, y);
      y += 25;

      if (wData.focus) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...secondaryColor);
          doc.text(`Focus Area: `, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(wData.focus, margin + 70, y);
          y += 25;
      }

      weekSessions.forEach((session) => {
          const games = session.selectedGames || [];
          const numLines = games.length > 0 ? games.length : 1;
          const cardHeight = Math.max(90, 65 + (numLines * 15));
          
          checkPageBreak(cardHeight + 20);

          doc.setFillColor(...cardBg);
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(1);
          doc.roundedRect(margin, y, contentWidth, cardHeight, 8, 8, 'FD');

          let cardY = y + 25;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...textColor);
          const sTitle = session.sessionNumber === "Unassigned" ? "Floating Session" : `Session ${session.sessionNumber.toString().replace('Session ', '')}`;
          doc.text(sTitle, margin + 15, cardY);
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...accentColor);
          doc.text(`Theme: ${session.programTheme || wData.theme}`, margin + 150, cardY);
          cardY += 20;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...secondaryColor);
          doc.text(`Focus: ${session.programFocus || wData.focus}`, margin + 15, cardY);
          cardY += 20;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...textColor);
          doc.text("Planned Activities:", margin + 15, cardY);
          cardY += 20;

          if (games.length > 0) {
              doc.setFont('helvetica', 'normal');
              games.forEach(game => {
                  doc.text(`• ${game.title} - ${game.actualDuration} min`, margin + 25, cardY);
                  cardY += 15;
              });
          } else {
              doc.setFont('helvetica', 'italic');
              doc.setTextColor(180, 180, 180);
              doc.text(`No activities planned yet.`, margin + 25, cardY);
              cardY += 15;
          }

          y += cardHeight + 15;
      });
      y += 15;
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        
        doc.text("Confidential – Positive Emotions Lab", margin, pageHeight - 30);
        const footerRight = "Generated from Session Planner";
        doc.text(footerRight, pageWidth - margin - doc.getTextWidth(footerRight), pageHeight - 30);
        
        doc.text(String(i), pageWidth / 2, pageHeight - 30, { align: 'center' });
    }

    doc.save(`Program_${program.name || 'Roadmap'}.pdf`);
  } catch (err) {
    console.error('Failed to generate Program PDF', err);
    alert('Error generating Program PDF. Check console.');
  }
};
