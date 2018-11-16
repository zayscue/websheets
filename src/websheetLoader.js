import XLSX from 'xlsx';
import WebSheet from './websheet';

class WebSheetLoader {
    constructor() {
        this.canBeReadAsBinaryString = typeof FileReader !== 'undefined'
            && (FileReader.prototype||{}).readAsBinaryString;
        this.readType = this.canBeReadAsBinaryString 
            ? 'binary' : 'array';
    }

    parseExcelData(data) {
        return XLSX.read(data, {type: this.readType });
    }

    load(file) {
        var canBeReadAsBinaryString = this.canBeReadAsBinaryString;
        var parseExcelData = this.parseExcelData.bind(this);
        var reader = new FileReader();
        return new Promise(function(resolve, reject) {
            try {
                reader.onload = function(e) {
                    var data = e.target.result;
                    if(!canBeReadAsBinaryString)
                        data = new Uint8Array(data);
                    var workbook = parseExcelData(data);
                    var websheet;
                    for(var i = 0; i < workbook.SheetNames.length; i++) {
                        var sheetName = workbook.SheetNames[i];
                        var sheet = workbook.Sheets[sheetName];
                        websheet = new WebSheet(sheet);
                    }
                    resolve(websheet);
                }
                if(canBeReadAsBinaryString)
                    reader.readAsBinaryString(file);
                else 
                    reader.readAsArrayBuffer(file);
            } catch(err) {
                reject(err);
            }
        });
    }
}

export default WebSheetLoader;