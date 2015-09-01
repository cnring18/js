//secret santa function
var a = ['aaaaa','zzzzz','rrrrr','fffff','ooooo','wwwww','ddddd','ccccc','jjjjj'];
 
function r(array) {
    var a = array.slice(0),
        b = array.slice(0)
        p1, p2,
        i = 0,
        n = array.length, 
        rand,x, final = [];
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