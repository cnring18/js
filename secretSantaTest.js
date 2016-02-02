/*
    Testing function for a secret santa app
    All people (in array) get paired with another person that is NOT themselves
    Function output is array of each person and who they give to
*/



//secret santa function
var people = ['aa','zz','rr','ff','oo','ww','dd','cc','jj'];
 
function r(array) {
    var a = array.slice(0),                 //copying inital array into giving/receiving arrays
        b = array.slice(0),
        p1, p2,                             //giving/receiving person
        i = 0,
        n = array.length, 
        rand, x, finalPairs = [];           //random index to receive, index of giving person in receiving array, final give/receive pairings
    while(i<n) {
        p1 = a[0];
        x = b.indexOf(p1);
        do {								//random person in the receiving array that is not the person giving
            rand = Math.floor((Math.random() * b.length));
        } while(rand === x)
        p2 = b[rand];
        finalPairs[p1] = p2;				//pairing [person giving] with: person receving
        a.splice(0,1);                      //remove first person from giving list (used)
        b.splice(rand,1);                   //remove random (used) person from receiving list
        i++;
    }  
    return finalPairs;
}
 
console.log(r(people));