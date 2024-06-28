

export function splitImage(imageSrc, rows, cols, cb) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = function() {
    const pieceWidth = img.width / cols;
    const pieceHeight = img.height / rows;
    const pieces = [];

    for (let y = 0; y < rows; y++) {
      let row = []
      for (let x = 0; x < cols; x++) {
        const canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
        row.push(canvas.toDataURL());
      }
      pieces.push(row);
    }
    cb(pieces)
  }; 
}
export function SplitImagePage(imageSrc, rows, cols, cb) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = function() {
    const pieceWidth = img.width / cols;
    const pieceHeight = img.height / rows;
    const pieces = [];
    for (let y = 0; y < rows; y++) {
      
      for (let x = 0; x < cols; x++) {
        const canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
        pieces.push(canvas.toDataURL());
      }
      
    }
    cb(pieces)
  }
}

