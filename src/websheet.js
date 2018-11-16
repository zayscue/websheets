const coordinateMap = {
    alphabet : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    A : 1,
    B : 2,
    C : 3, 
    D : 4, 
    E : 5,
    F : 6,
    G : 7,
    H : 8,
    I : 9,
    J : 10,
    K : 11,
    L : 12,
    M : 13,
    N : 14,
    O : 15,
    P : 16,
    Q : 17,
    R : 18,
    S : 19,
    T : 20,
    U : 21,
    V : 22,
    W : 23,
    X : 24,
    Y : 25,
    Z : 26
};

class WebSheet {

    _coordinateMapProxyHandler = {
        get: function(target, name) {
            if(name in target) {
                return target[name];
            }
            if(!isNaN(name) && parseInt(name, 10) < 26 && parseInt(name, 10) >= 0) {
                return target.alphabet[parseInt(name, 10)];
            }
            return undefined;
        }
    }

    _coordinateMap = new Proxy(coordinateMap, this._coordinateMapProxyHandler);

    resourceSheet = null;

    dimensions = {
        height: 0,
        width: 0
    };

    table = [[]];

    constructor(resourceSheet) {
        this.resourceSheet = resourceSheet;
        var worksheetRefDimensions = resourceSheet['!ref'].toString().split(':');
        var topLeft = worksheetRefDimensions[0];
        var bottomRight = worksheetRefDimensions[1];
        var topLeftCoordinates = this._convertCellNumberToCoordinates(topLeft);
        var bottomRightCoordinates = this._convertCellNumberToCoordinates(bottomRight);
        var width = bottomRightCoordinates.x - topLeftCoordinates.x;
        var height = bottomRightCoordinates.y - topLeftCoordinates.y;
        this.dimensions = {
            width: width + 1,
            height: height + 1
        };
        this.table = [];
        for(var i = 0; i < this.dimensions.height; i++) {
            var row = [];
            for(var j = 0; j < this.dimensions.width; j++) {
                var cellNumber = this._convertCoordinatesToCellNumber(j, i);
                row.push(this.resourceSheet[cellNumber]);
            }
            this.table.push(row);
        }
    }

    _convertCellNumberToCoordinates(cellNumber) {
        var lastAlphaCharPos = 0;
        while(isNaN(cellNumber[lastAlphaCharPos])) {
            lastAlphaCharPos++;
        }
        var xChars = cellNumber.substring(0, lastAlphaCharPos).split('');
        var x = 0;
        for(var i = 0; i < xChars.length; i++) {
            x = x + (this._coordinateMap[xChars[i]] - 1);
        }
        var y = parseInt(cellNumber.substring(lastAlphaCharPos, cellNumber.length), 10) - 1;
        return {
            x: x,
            y: y
        };
    }

    _convertCoordinatesToCellNumber(x, y) {
        var cellNumber = "";
        if(x < 26) {
            cellNumber = cellNumber + this._coordinateMap[x];
        } else {
            var dividend = x + 1;
            var modulo;
            while(dividend > 0) {
                modulo = parseInt((dividend - 1) % 26, 10);
                cellNumber = this._coordinateMap[modulo] + cellNumber;
                dividend = parseInt((dividend - modulo) / 26, 10);
            }
        }
        return cellNumber + (y + 1);
    }

    getCellValueByCoordinates(x, y) {
        return this.table[x][y];
    }

    getCellValueByCellNumber(cellNumber) {
        return this.resourceSheet[cellNumber];
    }

    to2DArray() {
        var xarray = [];
        for(var i = 0; i < this.table.length; i++) {
            var yarray = [];
            for(var j = 0; j < this.table[i].length; j++) {
                var value = this.table[i][j];
                var cell = value !== undefined ? value.v : '';
                yarray.push(cell);
            }
            xarray.push(yarray);
        }
        return xarray;
    }
}

export default WebSheet;