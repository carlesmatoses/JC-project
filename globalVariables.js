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

// KEYS
const KEY_PRIMARY          = "KeyF";  //FIXME: MODIFICAR TECLA a OTRA
const KEY_SECONDARY        = "KeyG"; //FIXME: MODIFICAR TECLA a OTRA + Preguntar cual es
const KEY_UP               = "ArrowUp";
const KEY_DOWN             = "ArrowDown"; 
const KEY_LEFT             = "ArrowLeft";
const KEY_RIGHT            = "ArrowRight"; 
const KEY_DEBUBG           = "KeyB";  //FIXME: MODIFICAR TECLA a OTRA
const KEY_INVENTORY        = "KeyI";  //FIXME: Modificar tecla a otra
const KEY_INVULNERABLE     = "KeyG"; 

//NEW
const KEY_SHIELD           = "KeyX";
/*
//TODO: Quitar hardcode y poner bien las global variables
const KEY_USE_SP_OBJECT    = "KeyC"; 
const KEY_HEAL             = "KeyH";
const KEY_SKIP_MBOSS       = "KeyM"; 
const KEY_SKIP_FBOSS       = "KeyB";
const KEY_OBTAIN_SP_OBJECT = "KeyI"; 
const KEY_SWORD            = "KeyZ"; 




*/