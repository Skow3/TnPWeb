import React, { useState, useRef } from 'react';
import './InterviewPrep.scss';

const InterviewPrep = ({ pdfSrc, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef(null);

  const handlePdfLoad = () => {
    setIsLoading(false);
    // For local PDFs, we can try to get page count after a delay
    setTimeout(() => {
      try {
        const iframe = iframeRef.current;
        if (iframe) {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          const viewer = doc.querySelector('#viewer');
          if (viewer) {
            const pages = viewer.querySelectorAll('.page');
            setNumPages(pages.length);
          }
        }
      } catch (error) {
        console.log("Couldn't access PDF page count", error);
      }
    }, 2000);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < (numPages || 999)) { // Fallback if numPages not detected
      setCurrentPage(currentPage + 1);
      scrollToPage(currentPage + 1);
    }
  };

  const scrollToPage = (pageNum) => {
    try {
      const iframe = iframeRef.current;
      if (iframe) {
        // For local PDFs, we can try to scroll to the page
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const pageElement = doc.querySelector(`.page[data-page-number="${pageNum}"]`);
        if (pageElement) {
          pageElement.scrollIntoView();
        } else {
          // Fallback to hash navigation
          iframe.contentWindow.location.hash = `page=${pageNum}`;
        }
      }
    } catch (error) {
      console.log("Couldn't navigate to page", error);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  return (
    <div className="card-container-interview-prep">
      <div className="interview-prep" style={{padding:" 2rem 1rem"}}><h2 className="team-profiles__heading">{title}</h2>
        <div className="interview-prep__container">
          {/* {title && <h2 className="interview-prep__title">{title}</h2>} */}
          
          <div className="interview-prep__controls">
            {/* <div className="interview-prep__navigation">
              <button onClick={goToPrevPage} disabled={currentPage <= 1}>
                &lt; Prev
              </button>
              <span>
                Page {currentPage}{numPages ? ` of ${numPages}` : ''}
              </span>
              <button onClick={goToNextPage} disabled={numPages && currentPage >= numPages}>
                Next &gt;
              </button>
            </div> */}
            
            <div className="interview-prep__zoom">
              <button onClick={zoomOut}>-</button>
              <button onClick={resetZoom}>{Math.round(scale * 100) }%</button>
              <button onClick={zoomIn}>+</button>
            </div>
            
            <a 
              href={pdfSrc} 
              download 
              className="interview-prep__download-btn"
            >
              Download PDF
            </a>
          </div>
          
          <div className="interview-prep__pdf-container">
            {isLoading && (
              <div className="interview-prep__loading">
                <div className="interview-prep__loading-spinner"></div>
                <p>Loading PDF...</p>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              className="interview-prep__pdf-frame"
              src={`${pdfSrc}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1`}
              title={title}
              onLoad={handlePdfLoad}
              style={{ transform: `scale(${scale})`, transformOrigin: '0 0', width: `${100/scale}%`, height: `${100/scale}%` }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

InterviewPrep.defaultProps = {
  pdfSrc: 'https://storage.googleapis.com/tnpsite/Doc.pdf',
  title: 'Interview Preparation Guide'
};

export default InterviewPrep;