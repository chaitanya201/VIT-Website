import React, { useState } from 'react'
import Excel from "@grapecity/spread-excelio";
import { saveAs } from 'file-saver';
export default function DownloadExcelFile() {
    
    const [_spread, setSpread] = useState({});
   
    function exportSheet() {
        const spread = _spread;
        const fileName = "SalesData.xlsx";
        const excelIO = new Excel.IO();
        const json = JSON.stringify(spread.toJSON({ 
            includeBindingSource: true,
            columnHeadersAsFrozenRows: true,
        }));
        excelIO.save(json, (blob) => {
            saveAs(blob, fileName);
        }, function (e) {  
            alert(e);  
        });     
    }
  return (
    <div>
        <button className="bg-red-400" 
          onClick={exportSheet}>Export to Excel</button>
    </div>
  )
}
