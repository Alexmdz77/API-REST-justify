
function justify(str,ln) {
    e=0;
    result="";
    // split paragraphes
    str1=str.split(" \n\n");
    while (e<str1.length) {
        // split mots
        var res = str1[e].split(" ");
        var ree = [];    
        var i =j= 0;
        // Retire les espaces en trop
        while (i<res.length) {
            if(res[i].replace(/ /g,'')!='') {
                ree[j]=res[i].replace(/ /g,''); j++;
            }
            i++;
        }
        // 
        lines="";
        i=j=k=slice1=0;
        var line=[];
        var line2="";
        var leng=0;
        var t=ln;
        var re=ree;
        var l=ree.length;
        m=0;
        var slice=0;
        while(true){
            i=j=0;
            var line=[];
            var line2="";
            var leng=0;
            // tant que longueur de ligne insuffisante
            while(leng<t+1){
              
                af=re[i].length;
                if ( t-leng<af && leng!=t) 
                {
                   while((j<t-leng+1) && (j<i-1)) {
                       line[j]+=' ';j++;
                   }
                   // Ajout d'un espace en fin de ligne
                   line[i-1]=line[i-1].replace(/ /g,' ');
                   // Ajout des espaces entre les mots
                   nb=t-leng-i+2
                   if(nb>0)line[i-2]+=" ".repeat(nb);
                   slice1=i;
                   line[i-1]+=" \n";
                   break;
                } 
                // Ligne complète -> Ajout d'un saut à la ligne 
                else if(leng==t)
                {
                   line[i-1]=line[i-1].replace(/ /g,'')+' \n';
                   line[i-2]+=" ";
                   slice1=i;
                   break;
                }
                // Ligne complète -> Ajout d'un saut à la ligne 
                else if(t-leng==af){
                   line[i]=re[i]+' \n';
                   slice1=i+1;
                   break;
                }
                else {
                   line[i]=re[i]+' ';
                   slice1=i+1;
                }
                leng+=line[i].length;
                  // console.log(leng);
                i++;
                // fin
                if (re.length<=i) {break;}
            }
            slice = slice+slice1; k=0;
            while(k<line.length) {
                line2=line2+line[k];k++;
            }
               
            lines=lines+line2;
            if (slice>=l) {break;}
              
            re=ree.slice(slice);
        }
        e++;
        result= result+lines+' \n';
    }
    return result;
}

module.exports = justify;