import * as pdfjs from 'pdfjs-dist';

// Set up the PDFjs worker URL dynamically in a Vite-compatible format
import pdfjsWorker from 'pdfjs-dist/build/pdfjs.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Parses and extracts text content page-by-page from a PDF File object.
 * @param {File} file - PDF file to extract text from.
 * @returns {Promise<string>} Extracted plain text content.
 */
export async function parsePdfText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let textResult = '';
    
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      const textContent = await page.getTextContent();
      
      let pageText = '';
      let previousY = null;
      
      for (const item of textContent.items) {
        const currentY = item.transform[5]; // Y-coordinate of text position
        
        if (previousY !== null && Math.abs(currentY - previousY) > 5) {
          // If vertical offset is notable, insert line break
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          // Add spacing between items on same line
          pageText += ' ';
        }
        
        pageText += item.str;
        previousY = currentY;
      }
      
      textResult += pageText + '\n\n';
    }
    
    return textResult.trim();
  } catch (error) {
    console.error('PDF Text Extraction Error:', error);
    throw new Error('Could not parse PDF. The file might be corrupted or encrypted. Please copy and paste instead.');
  }
}
