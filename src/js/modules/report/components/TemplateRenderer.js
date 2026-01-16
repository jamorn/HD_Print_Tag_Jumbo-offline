/**
 * Template Renderer Component
 * Converted from hd_report.html to ES6 module
 * Supports 3 templates with position-based rendering
 * Supports object-based controlprint { ft, lt }
 */

/**
 * Render complete tag page based on template
 * @param {string} template - Template ID (template1, template2, template3)
 * @param {Object} data - Report data
 * @param {number} pageNumber - Current page number
 * @returns {string} HTML string for one page
 */
export function renderTagPage(template, data, pageNumber) {
    const {
        grade = '',
        netweight = '',
        lot = '',
        shift = '',
        idate = '',
        fromPage = 1,
        toPage = 1,
        unit = 'HDPE',
        title1 = '',
        title2 = '',
        sirim_title1 = '',
        sirim_title2 = '',
        sirim_title3 = '',
        qrCodeUrl = '',
        controlprint = { ft: false, lt: false }
    } = data;

    // Get template-specific content
    let templateContent = '';
    
    switch (template) {
        case 'template1':
            templateContent = renderTemplate1(data, pageNumber);
            break;
        case 'template2':
            templateContent = renderTemplate2(data, pageNumber);
            break;
        case 'template3':
            templateContent = renderTemplate3(data, pageNumber);
            break;
        default:
            templateContent = renderTemplate1(data, pageNumber);
    }

    return `
        <section class="sheet A4 landscape tag-page">
            ${templateContent}
        </section>
    `;
}

/**
 * Template 1: Description Only (Minimal)
 * No logos, no QR code
 */
function renderTemplate1(data, pageNumber) {
    const { grade, netweight, lot, unit, title1, title2, controlprint } = data;
    
    return `
        <div class="sheet" style="padding: 10mm; background-image: url(images/polimaxx.jpg); background-size: cover; position: relative; width: 100%; height: 100%;">
            ${renderHeaderTitle(title1, title2)}
            ${renderGrade(grade, unit)}
            ${renderLot(lot)}
            ${renderNetWeight(netweight, grade)}
            ${renderRunningNumber(pageNumber, data)}
            ${renderControlPrintMarkers(controlprint, pageNumber, data)}
        </div>
    `;
}

/**
 * Template 2: Description + Logos (MFG + QR)
 * Shows TIS logo and QR code
 */
function renderTemplate2(data, pageNumber) {
    const { grade, netweight, lot, unit, title1, title2, qrCodeUrl, controlprint } = data;
    
    return `
        <div class="sheet" style="padding: 10mm; background-image: url(images/polimaxx.jpg); background-size: cover; position: relative; width: 100%; height: 100%;">
            ${renderHeaderTitle(title1, title2)}
            ${renderLogosTemplate2(unit, qrCodeUrl)}
            ${renderGrade(grade, unit)}
            ${renderLot(lot)}
            ${renderNetWeight(netweight, grade)}
            ${renderRunningNumber(pageNumber, data)}
            ${renderControlPrintMarkers(controlprint, pageNumber, data)}
        </div>
    `;
}

/**
 * Template 3: Full Certifications (MFG + QR + SIRIM)
 * Shows all logos and certifications
 * Only available for HDPE
 */
function renderTemplate3(data, pageNumber) {
    const { grade, netweight, lot, unit, title1, title2, sirim_title1, sirim_title2, sirim_title3, qrCodeUrl, controlprint } = data;
    
    return `
        <div class="sheet" style="padding: 10mm; background-image: url(images/polimaxx.jpg); background-size: cover; position: relative; width: 100%; height: 100%;">
            ${renderHeaderTitle(title1, title2)}
            ${renderLogosTemplate3(unit, qrCodeUrl, sirim_title1, sirim_title2, sirim_title3)}
            ${renderGrade(grade, unit)}
            ${renderLot(lot)}
            ${renderNetWeight(netweight, grade)}
            ${renderRunningNumber(pageNumber, data)}
            ${renderControlPrintMarkers(controlprint, pageNumber, data)}
        </div>
    `;
}

/**
 * Render header title section
 */
function renderHeaderTitle(title1, title2) {
    return `
        <div style="position: absolute; left: 0; top: 240px; width: 550px; font-size: 60px; text-align: center; white-space: nowrap;">
            ${title1 || 'HDPE'}
        </div>
        <div style="position: absolute; left: 0; top: 320px; width: 550px; font-size: 30px; text-align: center; white-space: nowrap;">
            ${title2 || 'HIGH DENSITY POLYETHYLENE'}
        </div>
    `;
}

/**
 * Render grade with auto-positioning
 */
function renderGrade(grade, unit = 'HDPE') {
    const displayGrade = formatGradeForDisplay(grade);
    const gradeLength = displayGrade.length;
    
    let fontSize = 60;
    let rightOffset = 150;
    let topOffset = 150;
    
    // Auto-adjust font size based on grade length
    if (gradeLength <= 10) {
        fontSize = 60;
    } else if (gradeLength <= 12) {
        fontSize = 50;
    } else if (gradeLength <= 15) {
        fontSize = 42;
    } else {
        fontSize = 36;
    }
    
    return `
        <div style="position: absolute; right: ${rightOffset}px; top: ${topOffset}px; font-size: ${fontSize}px; color: black; margin: 0; text-align: right; white-space: nowrap; font-weight: bold;">
            ${displayGrade}
        </div>
    `;
}

/**
 * Render lot number
 */
function renderLot(lot) {
    return `
        <div style="position: absolute; left: 150px; top: 250px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">
            ${lot}
        </div>
    `;
}

/**
 * Render net weight with auto-positioning
 */
function renderNetWeight(netWeight, grade = '') {
    const formattedWeight = typeof netWeight === 'string' || typeof netWeight === 'number' 
        ? Number(netWeight).toLocaleString('en-US') 
        : netWeight;
    
    // Adjust position based on netweight length (similar to React-like-V2)
    let leftPosition = 895;
    let topPosition = 323;
    
    if (netWeight && parseInt(netWeight) >= 1000) {
        leftPosition = 865;
    }
    
    return `
        <div style="position: absolute; left: ${leftPosition}px; top: ${topPosition}px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">
            ${formattedWeight}
        </div>
    `;
}

/**
 * Render running number (page-date-shift format)
 */
function renderRunningNumber(pageNumber, data) {
    const { shift = '', idate = '' } = data;
    const paddedPage = String(pageNumber).padStart(3, '0');
    const paddedDate = String(idate).padStart(2, '0');
    
    return `
        <div style="position: absolute; right: 130px; top: 660px; display: flex; gap: 5px;">
            ${renderDigitBox(paddedPage[0])}
            ${renderDigitBox(paddedPage[1])}
            ${renderDigitBox(paddedPage[2])}
            <div class="bno-middle">-</div>
            ${renderDigitBox(paddedDate[0])}
            ${renderDigitBox(paddedDate[1])}
            <div class="bno-middle">-</div>
            ${renderDigitBox(shift)}
        </div>
    `;
}

/**
 * Render single digit box
 */
function renderDigitBox(digit) {
    return `
        <div class="bno" style="border: 2px solid black; height: 40px; width: 30px; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 5px; vertical-align: middle;">
            ${digit}
        </div>
    `;
}

/**
 * Render control print markers (FT/LT)
 * Supports object-based controlprint { ft, lt }
 */
function renderControlPrintMarkers(controlprint, pageNumber, data) {
    const { fromPage = 1, toPage = 1 } = data;
    let markers = '';
    
    // Support both object and legacy formats
    const ftEnabled = typeof controlprint === 'object' ? controlprint.ft : false;
    const ltEnabled = typeof controlprint === 'object' ? controlprint.lt : false;
    
    // FT marker (First Tag - first page only)
    if (ftEnabled && pageNumber === Number(fromPage)) {
        markers += `
            <div style="position: absolute; top: 340px; right: 180px; display: block;">
                <p style="font-size: 50px; margin: 0;">(F/T)</p>
            </div>
        `;
    }
    
    // LT marker (Last Tag - last page only)
    if (ltEnabled && pageNumber === Number(toPage)) {
        markers += `
            <div style="position: absolute; top: 495px; right: 180px; display: block;">
                <p style="font-size: 50px; margin: 0;">(L/T)</p>
            </div>
        `;
    }
    
    return markers;
}

/**
 * Render logos for Template 2 (MFG + QR Code)
 */
function renderLogosTemplate2(unit, qrCodeUrl) {
    const tisText = getTISText(unit);
    
    return `
        <div style="position: absolute; left: 140px; top: 430px; width: 120px; display: block;">
            <img src="images/mfg.png" style="width: 100%; height: auto;" alt="MFG Logo">
            <p style="font-size: 14px; text-align: center; margin: 5px 0;">${tisText}</p>
        </div>
        ${qrCodeUrl ? `
            <div style="position: absolute; left: 270px; top: 430px; width: 120px; display: block;">
                <div id="qrcode-${Date.now()}" style="width: 120px; height: 120px;"></div>
                <script>
                    new QRCode(document.getElementById('qrcode-${Date.now()}'), {
                        text: '${qrCodeUrl}',
                        width: 120,
                        height: 120
                    });
                </script>
            </div>
        ` : ''}
    `;
}

/**
 * Render logos for Template 3 (Full: MFG + QR + SIRIM)
 */
function renderLogosTemplate3(unit, qrCodeUrl, sirim_title1, sirim_title2, sirim_title3) {
    const tisText = getTISText(unit);
    
    return `
        <div style="position: absolute; left: 35px; top: 430px; width: 120px; display: block;">
            <img src="images/mfg.png" style="width: 100%; height: auto;" alt="MFG Logo">
            <p style="font-size: 14px; text-align: center; margin: 5px 0;">${tisText}</p>
        </div>
        ${qrCodeUrl ? `
            <div style="position: absolute; left: 180px; top: 430px; width: 120px; display: block;">
                <div id="qrcode-${Date.now()}" style="width: 120px; height: 120px;"></div>
                <script>
                    new QRCode(document.getElementById('qrcode-${Date.now()}'), {
                        text: '${qrCodeUrl}',
                        width: 120,
                        height: 120
                    });
                </script>
            </div>
        ` : ''}
        <div style="position: absolute; left: 320px; top: 430px; width: 120px; display: block;">
            <img src="images/sirim_logo.png" style="width: 100%; height: auto;" alt="SIRIM Logo">
        </div>
        <div style="position: absolute; left: 250px; top: 570px; width: 250px; text-align: left; font-size: 12px;">
            ${sirim_title1 ? `<p style="margin: 2px 0;">${sirim_title1}</p>` : ''}
            ${sirim_title2 ? `<p style="margin: 2px 0;">${sirim_title2}</p>` : ''}
            ${sirim_title3 ? `<p style="margin: 2px 0;">${sirim_title3}</p>` : ''}
        </div>
    `;
}

/**
 * Get TIS text based on unit
 */
function getTISText(unit) {
    switch (unit) {
        case 'HDPE':
            return 'TIS. 2599-2544 (2011)';
        case 'PP':
        case 'PPC':
            return 'TIS. 2300-2556 (2013)';
        default:
            return 'TIS. 2599-2544 (2011)';
    }
}

/**
 * Format grade for display
 * Handles /SB/ format and netweight display
 */
function formatGradeForDisplay(grade) {
    if (!grade) return '';
    
    // Remove /SB/ suffix if present (e.g., "P901BK/SB" -> "P901BK/SB")
    // Keep as-is, no transformation needed for display
    return grade;
}

/**
 * Generate complete report HTML for multiple pages
 */
export function generateMultiPageReport(template, data) {
    const { fromPage = 1, toPage = 1 } = data;
    const pages = [];
    
    for (let pageNum = Number(fromPage); pageNum <= Number(toPage); pageNum++) {
        pages.push(renderTagPage(template, data, pageNum));
    }
    
    return pages.join('\n');
}
