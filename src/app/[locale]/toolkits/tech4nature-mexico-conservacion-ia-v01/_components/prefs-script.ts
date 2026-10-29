export const PREFS_KEY = "tk-prefs";

/**
 * Se ejecuta antes de pintar (desde el layout del servidor) para que el tema y
 * el tamaño de letra elegidos no parpadeen al cargar. Debe coincidir con la
 * lógica de `PrefsProvider`.
 */
export const PREFS_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  PREFS_KEY,
)})||"{}");var d=document.documentElement.dataset;var t=p.theme==="light"||p.theme==="system"?p.theme:"dark";if(t==="system"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.tkTheme=t;d.tkFs=p.fontSize||"md";if(p.spacing)d.tkSpacing="wide";if(p.underline)d.tkLinks="underline";if(p.reduceMotion)d.tkMotion="reduce"}catch(e){}})();`;
