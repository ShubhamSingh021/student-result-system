// ΓöÇΓöÇ UI State Management & Rendering ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const views = {
  empty:   () => document.getElementById('emptyState'),
  loading: () => document.getElementById('loadingState'),
  result:  () => document.getElementById('resultCard'),
  error:   () => document.getElementById('errorCard'),
};

function hideAllViews() {
  Object.values(views).forEach(fn => fn().classList.add('hidden'));
}

function showEmptyState() {
  hideAllViews();
  views.empty().classList.remove('hidden');
  currentResult = null;
}

function showLoadingState(rollNo) {
  hideAllViews();
  views.loading().classList.remove('hidden');
  document.getElementById('loadingTitle').textContent = `Fetching result for ${rollNo}ΓÇª`;
  resetSteps();
  animateSteps();
}

function showErrorState(title, message) {
  hideAllViews();
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorMsg').textContent = message;
  views.error().classList.remove('hidden');
  currentResult = null;
}

function clearErrorView() {
  showEmptyState();
  document.getElementById('rollInput').focus();
}

function clearResultView() {
  showEmptyState();
  document.getElementById('rollInput').value = '';
  document.querySelectorAll('.student-item').forEach(el => el.classList.remove('active'));
}

// ΓöÇΓöÇ Progress Steps Animation ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

let stepTimer = null;

function resetSteps() {
  clearTimeout(stepTimer);
  for (let i = 1; i <= 4; i++) {
    const s = document.getElementById(`step${i}`);
    s.className = 'step';
    s.querySelector('.step-dot').style.background = '';
  }
  document.getElementById('step1').classList.add('active');
}

function animateSteps() {
  // Axios flow is ~5-15s total: GET(2s) ΓåÆ tokens(1s) ΓåÆ POST(5s) ΓåÆ parse(2s)
  const delays = [0, 2000, 4500, 8000];
  for (let i = 1; i <= 4; i++) {
    const idx = i;
    setTimeout(() => {
      // Mark previous as done
      if (idx > 1) {
        const prev = document.getElementById(`step${idx - 1}`);
        prev.className = 'step done';
      }
      const cur = document.getElementById(`step${idx}`);
      cur.className = 'step active';
    }, delays[i - 1]);
  }
}

function completeSteps() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step${i}`).className = 'step done';
  }
}

// ΓöÇΓöÇ Result Rendering ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function renderResult(data) {
  completeSteps();
  hideAllViews();

  // Avatar initials
  const name = data.studentName || data.rollNo || 'S';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
  const avatarEl = document.getElementById('studentAvatar');
  if (avatarEl) avatarEl.textContent = initials;

  // Profile info (Safety Loop to handle cached HTML versions)
  const setMultiTxt = (ids, val) => {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || 'ΓÇö';
    });
  };

  setMultiTxt(['studentName', 'displayName'], data.studentName);
  setMultiTxt(['displayRollNo', 'rollNo', 'rollNoVal'], data.rollNo);
  setMultiTxt(['displayCollege', 'collegeName', 'collegeNameVal'], data.collegeName);
  setMultiTxt(['displayEnrollment', 'enrollmentNo', 'enrollmentNoVal'], data.enrollmentNo);
  setMultiTxt(['displaySection', 'section', 'sectionName'], data.section ? `SECTION ${data.section.toUpperCase()}` : 'ΓÇö');
  setMultiTxt(['displaySgpa', 'sgpaValue', 'sgpa'], data.sgpa);

  // Direct Inject for UI labels (Failsafe)
  try {
    const clg = document.getElementById('collegeName');
    const enr = document.getElementById('enrollmentNo');
    if (clg && data.collegeName) clg.textContent = data.collegeName;
    if (enr && data.enrollmentNo) enr.textContent = data.enrollmentNo;
  } catch (e) {
    console.warn('Direct UI injection failed', e);
  }
  
  const finalStatus = (data.status || data.result || 'PASS').toUpperCase();
  setMultiTxt(['displayStatus', 'resultStatus'], finalStatus);

  // Result badge
  const badgeEl = document.getElementById('resultBadge');
  if (badgeEl) {
    badgeEl.textContent = finalStatus;
    badgeEl.className = `result-badge status-${finalStatus.toLowerCase()}`;
  }

  // SGPA
  setMultiTxt(['sgpaValue', 'displaySgpa'], data.sgpa || '0.00');

  // Backlogs
  const tag = document.getElementById('backlogTag');
  if (data.backlogs > 0) {
    tag.textContent = `${data.backlogs} Backlog${data.backlogs > 1 ? 's' : ''}`;
    tag.classList.remove('hidden');
  } else {
    tag.classList.add('hidden');
  }

  // Source badge
  const src = document.getElementById('sourceBadge');
  if (data.source === 'cache') {
    src.textContent = 'ΓÜí CACHED';
    src.className = 'source-badge source-cache';
  } else {
    src.textContent = '≡ƒîÉ LIVE FETCH';
    src.className = 'source-badge source-scraped';
  }
  const dt = data.extractedAt ? new Date(data.extractedAt).toLocaleString('en-IN') : 'ΓÇö';
  document.getElementById('fetchedAt').textContent = `Extracted: ${dt}`;

  // Subjects table
  const tbody = document.getElementById('subjectsBody');
  if (data.subjects && data.subjects.length > 0) {
    tbody.innerHTML = data.subjects.map((s, i) => {
      const isFail   = s.grade === 'F';
      const gradeClass = isFail ? 'grade-f' : 'grade-pass';
      const statusHtml = isFail
        ? `<span class="status-pill status-fail">FAIL</span>`
        : `<span class="status-pill status-pass">PASS</span>`;
      return `
        <tr>
          <td class="num">${i + 1}</td>
          <td style="font-weight:500">${s.title || 'ΓÇö'}</td>
          <td class="mono" style="color:var(--text-2)">${s.code || 'ΓÇö'}</td>
          <td class="num">${s.midMarks ?? 'ΓÇö'}</td>
          <td class="num">${s.endMarks ?? 'ΓÇö'}</td>
          <td class="grade-cell ${gradeClass}">${s.grade || 'ΓÇö'}</td>
          <td style="text-align:center">${statusHtml}</td>
        </tr>`;
    }).join('');
  } else {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center;color:var(--text-3);padding:2rem">
        No subject data found in this result PDF.
      </td></tr>`;
  }

  // Final result footer
  const footerEl = document.getElementById('finalResult');
  if (footerEl) {
    footerEl.textContent = finalStatus;
    footerEl.className   = `final-value ${finalStatus.toLowerCase()}`;
  }

  const backlogFinal = document.getElementById('backlogFinal');
  if (data.backlogs > 0) {
    backlogFinal.textContent = `${data.backlogs} Subject${data.backlogs > 1 ? 's' : ''} Failed`;
    backlogFinal.classList.remove('hidden');
  } else {
    backlogFinal.classList.add('hidden');
  }

  views.result().classList.remove('hidden');
}

// ΓöÇΓöÇ PDF Download via jsPDF ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function downloadPDF() {
  if (!currentResult) return;

  try {
    const { jsPDF } = window.jspdf;
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const data = currentResult;
    const pageW = doc.internal.pageSize.getWidth();

    // ΓöÇΓöÇ Header band
    doc.setFillColor(18, 30, 60);
    doc.rect(0, 0, pageW, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16); doc.setFont(undefined, 'bold');
    doc.text('Rajasthan Technical University', pageW / 2, 14, { align: 'center' });
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    doc.text('Student Mark Sheet ΓÇö B.Tech Semester V (2025-26)', pageW / 2, 22, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(160, 180, 220);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageW / 2, 30, { align: 'center' });

    // ΓöÇΓöÇ Student Details
    const infoY = 46;
    doc.setDrawColor(220, 228, 245);
    doc.roundedRect(14, infoY - 5, pageW - 28, 38, 2, 2);

    doc.setTextColor(60, 80, 130);
    doc.setFontSize(9); doc.setFont(undefined, 'bold');
    doc.text('STUDENT INFORMATION', 18, infoY + 2);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10); doc.setFont(undefined, 'normal');

    const col1x = 18, col2x = pageW / 2 + 5;
    let iy = infoY + 10;
    const row = (label, val, x) => {
      doc.setFont(undefined, 'bold'); doc.text(`${label}:`, x, iy);
      doc.setFont(undefined, 'normal'); doc.text(String(val || 'ΓÇö'), x + 36, iy);
    };

    row('Name',    data.studentName, col1x);
    row('Roll No', data.rollNo,      col2x);
    iy += 8;
    row("Father's Name", data.fatherName, col1x);
    row("Mother's Name", data.motherName, col2x);
    iy += 8;
    row('Section', data.section ? `Section ${data.section}` : 'ΓÇö', col1x);

    // Result + SGPA chips
    const res = (data.result || '').toUpperCase();
    const isPass = res === 'PASS';
    doc.setFillColor(...(isPass ? [220, 255, 235] : [255, 225, 225]));
    doc.roundedRect(col2x, iy - 6, 40, 10, 2, 2, 'F');
    doc.setTextColor(...(isPass ? [20, 160, 80] : [200, 20, 50]));
    doc.setFontSize(11); doc.setFont(undefined, 'bold');
    doc.text(res, col2x + 20, iy + 1, { align: 'center' });

    // ΓöÇΓöÇ Subject Table
    const tStartY = infoY + 44;
    if (data.subjects && data.subjects.length > 0) {
      const tableBody = data.subjects.map((s, i) => [
        i + 1,
        s.title   || 'ΓÇö',
        s.code    || 'ΓÇö',
        s.midMarks ?? 'ΓÇö',
        s.endMarks ?? 'ΓÇö',
        s.grade   || 'ΓÇö',
        s.grade === 'F' ? 'FAIL' : 'PASS'
      ]);

      doc.autoTable({
        startY: tStartY,
        head: [['#', 'Course Title', 'Code', 'Mid', 'End', 'Grade', 'Status']],
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3.5, font: 'helvetica' },
        headStyles: { fillColor: [30, 55, 120], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          2: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 18, halign: 'center' },
          5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 22, halign: 'center' }
        },
        didParseCell(d) {
          if (d.section === 'body') {
            if (d.column.index === 5 && d.cell.raw === 'F') {
              d.cell.styles.textColor = [200, 20, 50];
            }
            if (d.column.index === 6) {
              d.cell.styles.textColor = d.cell.raw === 'FAIL' ? [200, 20, 50] : [20, 160, 80];
            }
          }
        },
        didDrawPage() {}
      });
    }

    // ΓöÇΓöÇ Footer
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : tStartY + 10;
    doc.setFillColor(245, 248, 255);
    doc.roundedRect(14, finalY, pageW - 28, 16, 2, 2, 'F');
    doc.setFontSize(10); doc.setFont(undefined, 'bold');
    doc.setTextColor(isPass ? [20, 160, 80] : [200, 20, 50]);
    doc.text(`Overall Result: ${res}  |  SGPA: ${data.sgpa || 'N/A'}  |  Backlogs: ${data.backlogs || 0}`, pageW / 2, finalY + 10, { align: 'center' });

    doc.setFontSize(7.5); doc.setTextColor(160);
    doc.text('This is a computer-generated sheet. For official result, visit results.rtu.ac.in', pageW / 2, finalY + 22, { align: 'center' });

    doc.save(`RTU_Result_${data.rollNo}_SemV.pdf`);
    showToast('PDF downloaded!', 'success');

  } catch (err) {
    console.error('PDF error:', err);
    showToast('Failed to generate PDF. Check console for details.', 'error');
  }
}

// ΓöÇΓöÇ Toast ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

let _toastTimer = null;
function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  const icons = { success: 'Γ£à', error: 'Γ¥î', info: 'Γä╣∩╕Å' };
  el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.add('hidden'), 4500);
}
