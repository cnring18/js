//secret santa function
var a = ['aaaaa','zzzzz','rrrrr','fffff','ooooo','wwwww','ddddd','ccccc','jjjjj'];
 
function r(array) {
    var a,b, p1, p2, i, n, rand,x, final = [];
    n = array.length;
    i = 0;
    a = array.slice(0);
    b = array.slice(0);
    while(i<n) {
        p1 = a[0];
        x = b.indexOf(p1);
        do {
            rand = Math.floor((Math.random() * b.length));
        } while(rand === x)
        p2 = b[rand];
        final[p1] = p2;
        a.splice(0,1);
        b.splice(rand,1);       
        i++;
    }  
    console.log(final);
}
 
r(a);