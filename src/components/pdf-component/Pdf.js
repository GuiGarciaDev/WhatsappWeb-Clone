import './style.scss'
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

export default function Pdf({docUrl, files, idx}) {
	
pdfjs.GlobalWorkerOptions.workerSrc =
`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const [numPages, setNumPages] = useState(null);
const [pageNumber, setPageNumber] = useState(1);

/*To Prevent right click on screen*/
document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});
	
/*When document gets loaded successfully*/
function onDocumentLoadSuccess({ numPages }) {
	setNumPages(numPages);
	setPageNumber(1);
}

function changePage(offset) {
	setPageNumber(prevPageNumber => prevPageNumber + offset);
}

function previousPage() {
	changePage(-1);
}

function nextPage() {
	changePage(1);
}

return (
    <div className="pdf">
        <div className='title-holder'>
            <p>{files[idx].name}</p>
            <span>{`${numPages} página(s)`}</span>
        </div>
        <Document
            file={docUrl}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <Page pageNumber={pageNumber} width={300}/>
        </Document>
        <div>
            {/* <div className="buttonc">
                <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                className="Pre"   
                >
                    Previous
                </button>
                <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                >
                    Next
                </button> 
            </div> */}
        </div>
    </div>
    )
}
