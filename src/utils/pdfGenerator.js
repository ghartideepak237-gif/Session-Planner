import jsPDF from 'jspdf';

export const generateSessionPDF = (session) => {
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    let y = 20;
    const margin = 20;
    const contentWidth = 170;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 53); // Accent color
    doc.text('Session Flow Guide', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${session.college || 'General Group'} | ${session.sessionNumber || 'N/A'}`, margin, y);
    y += 6;
    
    const totalDuration = session.selectedGames.reduce((acc, g) => acc + (g.actualDuration || 0), 0);
    doc.text(`Target: ${session.baseDuration} min | Planned: ${totalDuration} min`, margin, y);
    y += 10;
    
    if (session.notes) {
       doc.setFontSize(10);
       doc.setTextColor(80, 80, 80);
       doc.setFont('helvetica', 'italic');
       const splitNotes = doc.splitTextToSize(`Global Session Notes: ${session.notes}`, contentWidth);
       doc.text(splitNotes, margin, y);
       y += (splitNotes.length * 5) + 5;
    }

    doc.setLineWidth(0.2);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 190, y);
    y += 10;

    // Helper to check for page break and reset y
    const checkBreak = (needed) => {
      if (y + needed > 275) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Games Iteration
    session.selectedGames.forEach((game, index) => {
      checkBreak(30);

      // 1. Activity Name
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(`${index + 1}. ${game.title}`, margin, y);
      y += 6;

      // 2. Meta row: Duration | Flow Position | Category
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 107, 53);
      const meta = `${game.actualDuration} min | ${game.flowPosition} | ${game.category || game.theme_clean || 'Activity'}`;
      doc.text(meta, margin, y);
      y += 8;

      // 3. Strategic Objective
      if (game.objective) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('STRATEGIC OBJECTIVE:', margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const splitObj = doc.splitTextToSize(game.objective, contentWidth);
        doc.text(splitObj, margin, y);
        y += (splitObj.length * 4.5) + 4;
        checkBreak(10);
      }

      // 4. Context / When to Use
      if (game.context) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('CONTEXT / WHEN TO USE:', margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const splitCtx = doc.splitTextToSize(game.context, contentWidth);
        doc.text(splitCtx, margin, y);
        y += (splitCtx.length * 4.5) + 4;
        checkBreak(10);
      }

      // 5. Anchor Notes (Instructions/Rules)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text('ANCHOR NOTES:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const noteText = game.notes || game.rules || game.description || 'No notes provided.';
      const splitNotes = doc.splitTextToSize(noteText, contentWidth);
      doc.text(splitNotes, margin, y);
      y += (splitNotes.length * 4.5) + 12;

      // Divider
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, y - 6, 190, y - 6);
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
            return true;
        }
        return false;
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
      const pillGap = 20;
      const pillWidth = 80;
      const pillHeight = 24;
      const maxItemsThisRow = Math.min(program.duration, maxPillsPerRow);
      const startX = margin + (contentWidth - ((maxItemsThisRow * pillWidth) + ((maxItemsThisRow - 1) * pillGap))) / 2;
      
      for (let w = 1; w <= program.duration; w++) {
          const wIndex = w - 1;
          const row = Math.floor(wIndex / maxPillsPerRow);
          const col = wIndex % maxPillsPerRow;
          
          if (col === 0 && row > 0) {
             y += 40;
          }
          
          const xPos = startX + col * (pillWidth + pillGap);
          
          doc.setFillColor(...accentColor);
          doc.roundedRect(xPos, y, pillWidth, pillHeight, 12, 12, 'F');
          
          const textStr = program.duration > 8 ? `W${w}` : `Week ${w}`;
          doc.text(textStr, xPos + (pillWidth / 2), y + 16, { align: 'center' });
          
          if (w < program.duration && col < maxPillsPerRow - 1) {
              doc.setFillColor(...secondaryColor);
              const triX = xPos + pillWidth + (pillGap / 2);
              doc.triangle(triX - 3, y + 8, triX - 3, y + 16, triX + 3, y + 12, 'F');
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
    
    Object.entries(weeklyMap).forEach(([week, weekSessions], index) => {
      const wData = program.weeks.find(wItem => wItem.week === parseInt(week)) || { theme: '', focus: '' };
      
      if (index > 0) {
          y += 20; // consistent margin above week header
      }
      checkPageBreak(80);
      
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
          
          const focusHeaderLines = doc.splitTextToSize(wData.focus, contentWidth - 70);
          focusHeaderLines.forEach((line, i) => {
              doc.text(line, margin + 70, y + (i * 15));
          });
          y += (focusHeaderLines.length * 15) + 10;
      } else {
          y += 10;
      }

      weekSessions.forEach((session) => {
          const cardX = margin;
          const cardWidth = Math.min(contentWidth, 540); 
          const p = 16;
          let contentHeight = p;
          const maxWidth = cardWidth - (p * 2);

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const sTitle = session.sessionNumber === "Unassigned" ? "Floating Session" : `Session ${session.sessionNumber.toString().replace('Session ', '')}`;
          const titleLines = doc.splitTextToSize(sTitle, maxWidth);
          contentHeight += (titleLines.length * 14) + 8;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          const themeText = session.programTheme || wData.theme || "General";
          const themeLines = doc.splitTextToSize(themeText, maxWidth - 45); 
          contentHeight += (themeLines.length * 12) + 6;
          
          doc.setFont('helvetica', 'normal');
          const focusText = session.programFocus || wData.focus || "Various";
          const focusLines = doc.splitTextToSize(focusText, maxWidth - 40);
          contentHeight += (focusLines.length * 15) + 12; 
          
          const games = session.selectedGames || [];
          if (games.length > 0) {
              games.forEach(game => {
                  contentHeight += 25; // Activity Header (Title + Meta)
                  if (game.objective) contentHeight += (doc.splitTextToSize(game.objective, maxWidth - 10).length * 12) + 10;
                  if (game.context) contentHeight += (doc.splitTextToSize(game.context, maxWidth - 10).length * 12) + 10;
                  const notes = game.notes || game.rules || game.description || '';
                  if (notes) contentHeight += (doc.splitTextToSize(notes, maxWidth - 10).length * 12) + 10;
                  contentHeight += 15; // Padding between activities
              });
          }
          
          contentHeight += p;
          const cardHeight = contentHeight;
          checkPageBreak(cardHeight + 20);

          doc.setFillColor(...cardBg);
          doc.setDrawColor(220, 220, 225);
          doc.setLineWidth(1);
          doc.roundedRect(cardX, y, cardWidth, cardHeight, 8, 8, 'FD');

          let textY = y + p + 10;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...textColor);
          doc.text(titleLines, cardX + p, textY);
          textY += (titleLines.length * 14) - 10 + 8;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...accentColor);
          doc.text("Theme: ", cardX + p, textY + 10);
          doc.setTextColor(...textColor);
          doc.setFont('helvetica', 'normal');
          doc.text(themeLines, cardX + p + 45, textY + 10);
          textY += (themeLines.length * 12) + 6;
          
          doc.setTextColor(...secondaryColor);
          doc.setFont('helvetica', 'bold');
          doc.text("Focus: ", cardX + p, textY + 10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...textColor);
          focusLines.forEach((line, idx) => {
              doc.text(line, cardX + p + 40, textY + 10 + (idx * 15)); 
          });
          textY += (focusLines.length * 15) + 12;

          // Rich Activity Blocks
          if (games.length > 0) {
              games.forEach((game, gIdx) => {
                  doc.setFontSize(10);
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(...textColor);
                  const actTitle = `${gIdx+1}. ${game.title} (${game.actualDuration}m)`;
                  doc.text(actTitle, cardX + p, textY + 10);
                  textY += 14;

                  const meta = `${game.flowPosition} | ${game.category || game.theme_clean || 'Activity'}`;
                  doc.setFontSize(8);
                  doc.setTextColor(...accentColor);
                  doc.text(meta, cardX + p, textY + 8);
                  textY += 12;

                  if (game.objective) {
                      doc.setFont('helvetica', 'bold');
                      doc.setTextColor(...secondaryColor);
                      doc.text("Objective:", cardX + p, textY + 6);
                      doc.setFont('helvetica', 'normal');
                      doc.setTextColor(...textColor);
                      const sObj = doc.splitTextToSize(game.objective, maxWidth - 10);
                      doc.text(sObj, cardX + p, textY + 18);
                      textY += (sObj.length * 12) + 12;
                  }

                  if (game.context) {
                      doc.setFont('helvetica', 'bold');
                      doc.setTextColor(...secondaryColor);
                      doc.text("Context:", cardX + p, textY + 6);
                      doc.setFont('helvetica', 'normal');
                      const sCtx = doc.splitTextToSize(game.context, maxWidth - 10);
                      doc.text(sCtx, cardX + p, textY + 18);
                      textY += (sCtx.length * 12) + 12;
                  }

                  const notes = game.notes || game.rules || game.description;
                  if (notes) {
                      doc.setFont('helvetica', 'bold');
                      doc.setTextColor(...secondaryColor);
                      doc.text("Notes:", cardX + p, textY + 6);
                      doc.setFont('helvetica', 'normal');
                      const sNotes = doc.splitTextToSize(notes, maxWidth - 10);
                      doc.text(sNotes, cardX + p, textY + 18);
                      textY += (sNotes.length * 12) + 16;
                  }
                  
                  textY += 8;
              });
          }
          
          y += cardHeight + 20; 
      });
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
