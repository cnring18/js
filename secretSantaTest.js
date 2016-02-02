/*
    Testing function for a secret santa app
    All people (in array) get paired with another person that is NOT themselves
    Function output is array of each person and who they give to
*/



//secret santa function
var people = ['aa','zz','rr','ff','oo','ww','dd','cc','jj'];
 
function r(array) {
    var a = array.slice(0),
        b = array.slice(0),
        p1, p2,
        i = 0,
        n = array.length, 
        rand,x, finalPairs = [];
    while(i<n) {
        p1 = a[0];
        x = b.indexOf(p1);
        do {
            rand = Math.floor((Math.random() * b.length));
        } while(rand === x)
        p2 = b[rand];
        finalPairs[p1] = p2;
        a.splice(0,1);
        b.splice(rand,1);       
        i++;
    }  
    return finalPairs;
}
 
console.log(r(people));