/* hdr = full-color header logo (trimmed) + precomputed logoMode (plain|glow|tab) from its share of too-dark pixels; app.js re-measures at runtime when the canvas is readable.
   White-label inputs per club: name, color 1, color 2, logo (trimmed, with its pixel size). Photos are shared in this demo.
   Test Dark and Test Light are stress palettes: name text only, no logo. Never invent a logo. */
window.BRANDS={
  xgt:{id:'xgt',label:'XGT',name:'XGT Fitness Katy',c1:'#FC8107',c2:'#1E90FF',logo:{src:'assets/logos/xgt.png',w:560,h:211},white:{src:'assets/logos/xgt-white.png',w:560,h:211},loc:'Katy',hdr:{src:'assets/logos/xgt.png',w:560,h:211,mode:'plain',dark:.04}},
  usapt:{id:'usapt',label:'USA PT',name:'USA Personal Training',c1:'#E71F2C',c2:'#3C78E6',logo:{src:'assets/logos/usapt-white.png',w:480,h:316},white:{src:'assets/logos/usapt-white.png',w:480,h:316},loc:null,hdr:{src:'assets/logos/usapt.png',w:560,h:369,mode:'glow',dark:.81}},
  dark:{id:'dark',label:'Test Dark',name:'Test Dark Club',c1:'#1A1A1A',c2:'#2B2B2B',logo:null,mark:['TEST','DARK']},
  light:{id:'light',label:'Test Light',name:'Test Light Club',c1:'#F5E100',c2:'#FFFFFF',logo:null,mark:['TEST','LIGHT']}
};
window.LONG_NAME='Northshore Strength & Wellness'; /* 30 characters */
