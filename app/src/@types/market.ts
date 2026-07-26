import * as z from 'zod';

export const MarketSchema = z.preprocess(
  (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
  z.enum(["ae","ag","ai","am","ao","ar","at","au","az","ba","bb","be","bg","bh","bj","bm","bo","br","bs","bt","bw","by","bz","ca","cd","cg","ch","ci","cl","cm","cn","co","cr","cv","cy","cz","de","dk","dm","do","dz","ec","ee","eg","es","fi","fj","fm","fr","ga","gb","gd","ge","gh","gm","gr","gt","gw","gy","hk","hn","hr","hu","id","ie","il","in","iq","is","it","jm","jo","jp","ke","kg","kh","kn","kr","kw","ky","kz","la","lb","lc","lk","lr","lt","lu","lv","ly","ma","md","me","mg","mk","ml","mm","mn","mo","mr","ms","mt","mu","mv","mw","mx","my","mz","na","ne","ng","ni","nl","no","np","nz","om","pa","pe","pg","ph","pl","pt","py","qa","ro","rs","ru","rw","sa","sb","sc","se","sg","si","sk","sl","sn","sr","sv","sz","tc","td","th","tj","tm","tn","to","tr","tt","tw","tz","ua","ug","us","uy","uz","vc","ve","vg","vn","vu","xk","ye","za","zm","zw"]),
);

export type Market = z.infer<typeof MarketSchema>;
