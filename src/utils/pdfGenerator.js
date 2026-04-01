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

export const generateProgramPDF = (program, sessionsList) => {
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    let y = 20;
    const margin = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 53); // Accent color
    doc.text(program.name || 'Program Roadmap', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${program.college || 'General'} | Duration: ${program.duration} Weeks | ${program.totalSessions} Sessions`, margin, y);
    y += 10;

    if (program.objective) {
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const objectiveLines = doc.splitTextToSize(`Objective: ${program.objective}`, 170);
      doc.text(objectiveLines, margin, y);
      y += (objectiveLines.length * 6) + 4;
    }

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 190, y);
    y += 10;

    // Group by Week
    const weeklyMap = {};
    for (let w = 1; w <= program.duration; w++) {
      weeklyMap[w] = sessionsList.filter(s => s.programWeek === w);
    }

    Object.entries(weeklyMap).forEach(([week, weekSessions]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const wData = program.weeks.find(wItem => wItem.week === parseInt(week)) || { theme: '', focus: '' };

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(`Week ${week}: ${wData.theme}`, margin, y);
      y += 6;

      if (wData.focus) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(120, 120, 120);
        doc.text(`Focus Area: ${wData.focus}`, margin, y);
        y += 8;
      } else {
        y += 4;
      }

      weekSessions.forEach(session => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(`- ${session.sessionNumber} (${session.totalActualDuration} min structured)`, margin + 5, y);
        y += 6;

        if (session.selectedGames && session.selectedGames.length > 0) {
          session.selectedGames.forEach(game => {
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`• ${game.title} [${game.energyType}] - ${game.actualDuration}m`, margin + 10, y);
            y += 5;
          });
          y += 3;
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(180, 180, 180);
          doc.text('Unplanned', margin + 10, y);
          y += 6;
        }
      });

      y += 8; // Spacer between weeks
    });

    doc.save(`Program_${program.name || 'Roadmap'}.pdf`);
  } catch (err) {
    console.error('Failed to generate Program PDF', err);
    alert('Error generating Program PDF. Check console.');
  }
};
