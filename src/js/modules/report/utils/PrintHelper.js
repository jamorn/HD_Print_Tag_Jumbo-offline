/**
 * Print Helper Utility
 * Helper functions for printing reports
 */

/**
 * Open print preview window
 * @param {string} htmlContent - HTML content to print
 * @param {string} title - Window title
 */
export function openPrintPreview(htmlContent, title = 'Print Preview') {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
        alert('Please allow popups for this site to view print preview');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = title;
}

/**
 * Print directly without preview
 * @param {string} htmlContent - HTML content to print
 */
export function printDirect(htmlContent) {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert('Please allow popups for this site to print');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

/**
 * Generate print-ready HTML with styles
 * @param {string} bodyContent - Body HTML content
 * @param {string} additionalStyles - Additional CSS styles
 * @returns {string} Complete HTML document
 */
export function generatePrintHTML(bodyContent, additionalStyles = '') {
    return '<!DOCTYPE html>' +
        '<html lang="th">' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Print Report</title>' +
        '<link rel="stylesheet" href="../css/paper.css">' +
        '<style>' +
        '@media print {' +
        '@page { size: A4; margin: 0; }' +
        'body { margin: 0; padding: 0; }' +
        '.no-print { display: none !important; }' +
        '}' +
        additionalStyles +
        '</style>' +
        '</head>' +
        '<body>' +
        bodyContent +
        '</body>' +
        '</html>';
}

/**
 * Download report as PDF (requires browser print to PDF)
 * @param {string} htmlContent - HTML content
 * @param {string} filename - Suggested filename
 */
export function downloadAsPDF(htmlContent, filename = 'report.pdf') {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert('Please allow popups for this site to download PDF');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.document.title = filename;
    
    printWindow.onload = function() {
        printWindow.print();
    };
}

/**
 * Copy report to clipboard
 * @param {string} content - Content to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(content) {
    try {
        await navigator.clipboard.writeText(content);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}
