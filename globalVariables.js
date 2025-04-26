// Screen is composed of 10x9 tiles. last row is for UI 
const TILESWIDTH = 10;
const TILESHEIGHT = 9;
const TILEWIDTH = 1/TILESWIDTH;
const TILEHEIGHT = 1/TILESHEIGHT;

// Screen has size 0 to 1 in both directions
const PLAYSCREENWIDTH = TILEWIDTH * 10;
const PLAYSCREENHEIGHT = TILEHEIGHT * 8;
const UIWIDTH = TILEWIDTH * 10;
const UIHEIGHT = TILEHEIGHT * 1;