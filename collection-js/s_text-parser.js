/*
functions for the chemlambda collection site.
author: Marius Buliga
licence: CC-BY-4.0 for all text and images of this collection
last modified: 15.03.2020
*/

var collectionLength = collectionComments.length;
var imageMolList = listOfposts();

function NextPost() {

var bPost = document.getElementById("collection-number").innerHTML;

var  aPost = Number(bPost) + 1;
if (aPost >= collectionLength) {
  aPost = 0;
}

showThisPost(aPost);
}

function PreviousPost() {

var bPost = document.getElementById("collection-number").innerHTML;

var  aPost = Number(bPost) - 1;
if (aPost < 0) {
  aPost = collectionLength - 1;
}

showThisPost(aPost);
}


function RandomPost() {

var RandomPost = Math.floor(Math.random() * collectionLength);

showThisPost(RandomPost);
}

function StartingPost() {

  var whichPost = location.hash, numPost = 0;
  whichPost = whichPost.replace(/[^0-9]/g, "");

  if (whichPost == "") {
    RandomPost();
  } else {
    numPost = Number(whichPost);
    if ((numPost >=0) && (numPost < collectionLength)) { 
      showThisPost(numPost);
    } else {
      showThisPost(0);
    }
  }
}

function matchImageMol(image) {

  var curr = "", pref = 0, output2 = "", output = "", iej = 0;

  for (var ij=0; ij<verifiedMol.length; ij++) {
    curr = prefixLength(verifiedMol[ij].title,image);
    if (curr > pref) {
      output = verifiedMol[ij].mol;
      output2 = verifiedMol[ij].title;
      pref = curr;
      iej = ij;
    }
  }

  return {"index": iej, "mol": output, "title": output2};


}

function showThisPost(post) {

var text = collectionComments[post].description;
var image = collectionComments[post].title;

//
  var output = "", pref = 0, curr = "", ij, iej = 0, image2, text2, output2 =  "", output3 = "", inMol = [], lenMol, imageMol = {};


  imageMol = matchImageMol(image);
  iej = imageMol.index;
  output = imageMol.mol;
  output2 = imageMol.title;

//


image2 = "<img src=\"collection-small-gif/" + image + "\" style=\"width:300px;\">";
if (output2 == "") { 
  text2 = "<span>(" + image + ")</span> <br> <span2>(unavailable mol)</span2> <br> " + text;
} else {
  output3 = verifiedMol[iej].mol;
  inMol = output3.split("^");
  lenMol = inMol.length;
  if (lenMol > maxLengthMol) {
    output3 = "";
    text2 = "<span>(" + image + ")</span> <br> <span2>(mol too big)</span2> <br> " + text;
  } else {
    var molString = searchPostMol(output2);
    text2 = "<span>(" + image + ")</span> <br> <span5>probable mol: </span5><span2>(" + output2 + ".mol)</span2><span5>" + 
 molString + "</span5> <br> " + text;
  }
}



document.getElementById("collection-number").innerHTML = post;
document.getElementById("collection-image").innerHTML = image2;
document.getElementById("collection-text").innerHTML = text2;
document.getElementById("molyoulookat").innerHTML = output3;

PutLiveAnimation();

location.hash = "#" + post;
document.getElementById("citeas").innerHTML = location.hash;

}

function PutLiveAnimation() {

setSpeed(0); setStart(0); reloadCode();

}

// style=\"height:300px\"

function prefixLength(str,str2) {

  var alphastr = str.split("");
  var alphastr2 = str2.split("");
  var hamm = 0, len, i;
  if (alphastr.length < alphastr2.length) { len = alphastr.length;
  } else { len = alphastr2.length;}

  for (i=0; i<len; i++) {
    if (alphastr[i] == alphastr2[i]) { hamm +=1;
    } else { break;}
  }

  if (hamm < len) hamm = 0;
  return hamm;
}


function bestMatch(word,array) {

  var output = "", pref = 0, curr = "", i;
  
  for (i=0; i<array.length; i++) {
    curr = prefixLength(array[i],word);
    if (curr > pref) {
      output = array[i];
      pref = curr;
    }
  }

  return output;

}

function listOfposts() {

  var list = "[ <br>", i, image = "", molInfo = {};
  var listArray = [], listArrayItem = {};

  for (i=0; i<collectionLength; i++) {
    image = collectionComments[i].title;
    molInfo = matchImageMol(image);
    list += "{ \"numb\": " + i + " ,\"title\": \"" + image + "\" ,\"molused\": \"" + molInfo.title  + "\", \"molnumb\": " + molInfo.index +  " } <br>";
    listArrayItem = {numb: i, title: image, molused: molInfo.title, molnumb: molInfo.index };
    listArray.push(listArrayItem);
  }

//  document.getElementById("listofposts").innerHTML = list;
  return listArray;
}



function searchPostMol(mol) {
  var output = "", molUsed = "", molNumb;
  if (mol != "") {
    output += "<br><br> used in: &nbsp; "; 

    for (var i=0; i<imageMolList.length; i++) {
      molUsed = imageMolList[i].molused;
      molNumb = imageMolList[i].numb;
      if (mol == molUsed) {
        output += " <a href=\"collection.html#" + molNumb + "\" onclick=\"location.hash = " + molNumb + "; StartingPost();\">[" + molNumb + "]</a> &nbsp; ";
      } 
    }
  }
  output += "<br>";
  return output;
}
