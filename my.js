// search tips

/*
var request = new XMLHttpRequest();

	request.open('GET', 'http://suggest.yandex.ru/suggest-ya.cgi?ct=text/html&v=4&part='+part, true);
	request.onload = function (e) {
    if (request.readyState === 4) {
	        // Проверяем, успешно ли прошло получение данных.
	        if (request.status === 200) {
	            console.log(request.responseText);
	        } else {
	            console.error(request.statusText);
	        }
	    }
	};

request.send();*/

var date = new Date();

/* for JSONP - translate api*/
	function addScript(src) {
	  var elem = document.createElement("script");
	  elem.src = src;
	  document.head.appendChild(elem);
	}

var answers;
function otvetFun(input){
	console.log(input);
	answers =input[1];
	var tips=document.getElementById('tips')
	tips.innerHTML="";
	tips.style.display="block";
	for (var i = input[1].length - 1; i >= 0; i--) {
	 	tips.insertAdjacentHTML('afterBegin', '<div class=tips id="tip'+i+'">'+input[1][i] + ' </div>');
	}
};

document.getElementById('searchOne').focus();

var selectLine=0;
document.getElementById('searchOne').addEventListener('keydown',function (){getTips(this);});
document.getElementById('searchTwo').addEventListener('keydown',function (){getTips(this);});

function getTips(search){

	var part=search.value;
	keyCode = window.event.keyCode;
	if(keyCode==40){ //down key
		if(selectLine!=-1)document.getElementById('tip'+selectLine).style.backgroundColor="#FFF";
		selectLine++;
		if(selectLine>=10)selectLine=0;
		search.value=answers[selectLine];
		document.getElementById('tip'+selectLine).style.backgroundColor="#080";


	}else if(keyCode==38){// up key
		document.getElementById('tip'+selectLine).style.backgroundColor="#FFF";
		selectLine--;
		if(selectLine<0)selectLine=9;
		search.value=answers[selectLine];
		document.getElementById('tip'+selectLine).style.backgroundColor="#080";

	}else
	if(part.length>1){selectLine=-1;
		addScript(search.getAttribute('src')+part);
	}
}


document.onclick =function () {
	var tips=document.getElementById('tips')
	tips.innerHTML="";
	tips.style.display="none";
}


document.getElementById('rus').addEventListener('keyup',function (){getTranslate(this);});
//document.getElementById('rus').addEventListener('click',function (){getTranslate(this);});
document.getElementById('eng').addEventListener('keyup',function (){getTranslate(this);});



/*перевод в правильную раскладку*/
function autoLayoutKeyboard( defStr , direction) {
		let	lat='qwertyuiopasdfghjkl;\'zxcvbnm\,QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>`~[].';
		let	rus='йцукенгшщзфывапролджэячсмитьбЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮёЁхъю';
		let str1, str2,index,newStr='';
		if(direction=='ru-en'){ str1 = rus; str2 = lat; }
		else { str1 = lat; str2 = rus; }
		for(let i=0; i<defStr.length; i++){
          index=str2.indexOf(defStr[i])
					if(index != -1){
						newStr+=str1[index];
					}
          else newStr+=defStr[i];
				}
  return newStr
}


function translateFun(response){
	console.log(response);
	if(response['lang']=='ru-en')
		document.getElementById('eng').value=response['text'][0];
	else
		document.getElementById('rus').value=response['text'][0];
}

function getTranslate(translate) {
	apiKey='trnsl.1.1.20190114T224007Z.71ad469bf9a1040c.0e6f56e8deba3740e6967abbe39b6a60650f630d';
	keyCode=window.event.keyCode;
	if(translate.value.length>1)
	if(keyCode==13 || keyCode==37 || keyCode==39 || keyCode==32 || keyCode==9  || event.button<2){
		var src="https://translate.yandex.net/api/v1.5/tr.json/translate?options=1&callback=translateFun&key="+apiKey+"&lang="+translate.getAttribute('lang')+"&text=";
		addScript(src+translate.value);
	}

		translate.value=autoLayoutKeyboard( translate.value , translate.getAttribute('lang'))
}

function saveNote()
{
	let key =date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'_'+date.getHours()+':'+date.getMinutes();
	let val = '';
	val += (document.getElementById('rus').value)?   document.getElementById('rus').value       :'';
	val += (document.getElementById('eng').value)? ' | ' + document.getElementById('eng').value  :'';
	if(val){
		localStorage.setItem(key, val);
		document.getElementById('saveNote').innerHTML="сохранили";
		console.log(document.getElementById('saveNote'))
		}
}

function showNotes()
{
	let str='';
	for (let i=0; i < localStorage.length; i++) {
  str += "(" + localStorage.key(i) + "): " + localStorage.getItem(localStorage.key(i)) + "\r\n";
	}
	if(str)alert(str)
}

function clearNotes()
{
	if(prompt('стереть все заметки?? введите yes')=='yes'){
		localStorage.clear();
	}
}

document.getElementById('saveNote').addEventListener('click',()=>saveNote());
document.getElementById('showNotes').addEventListener('click',()=>showNotes());
document.getElementById('clearNotes').addEventListener('click',()=>clearNotes());

//////////////////// frames

document.getElementById('closedTabsButton').onclick=function () {
    var div = document.getElementById("closedTabsDiv_");
	if(div.innerHTML=="")
	{div.style.display="block";
		chrome.sessions.getRecentlyClosed(function(sessions){
		var count=0;
	console.log(sessions);
		for(var i = 0; i<sessions.length; i++){
				var sObt = sessions[i];
				//tab type or window type
				if(sObt.tab) {
					if(sObt.tab.url.indexOf('chrome://') ==-1 & sObt.tab.url.indexOf('about:') ==-1 & sObt.tab.url.indexOf('view-source:') ==-1) {
					count++;
					div.insertAdjacentHTML('beforeend',' <img src="chrome://favicon/'+sObt.tab.url+'" > <a href="'+sObt.tab.url+'">'+sObt.tab.title+'</a><br />');
					}
				}else{
						for(var j = 0; j<sObt.window.tabs.length; j++){
							count++;
							div.insertAdjacentHTML('beforeend',' <img src="chrome://favicon/'+sObt.window.tabs[j].url+'" > <a href="'+sObt.window.tabs[j].url+'">'+sObt.window.tabs[j].title+'</a><br />');
						}
				}
			}
		})
	}else
	{
		if(div.style.display=="block") div.style.display="none";
		else div.style.display="block";
	}
}

document.getElementById('TopSitesButton').onclick=function () {
    var div = document.getElementById("TopSitesDiv_");
	if(div.innerHTML==""){
		div.style.display="block";
	    chrome.topSites.get (function(url_list) {
	        for(var i=0;i<url_list.length;i++) {
	        	div.insertAdjacentHTML('beforeend',' <img src="chrome://favicon/'+url_list[i].url+'" > <a href="'+url_list[i].url+'">'+url_list[i].title+'</a><br />');

	        }
	    });
	}else
	{
		if(div.style.display=="block") div.style.display="none";
		else div.style.display="block";
	}

}

document.getElementById('BookMarksButton').onclick=function () {
    var div = document.getElementById("BookMarksDiv_");
	if(div.innerHTML==""){
		div.style.display="block";
	 	chrome.bookmarks.getTree(function(bookmarks) {
  			printBookmarks(bookmarks);
  		});
	}
	else
	{
		if(div.style.display=="block") div.style.display="none";
		else div.style.display="block";
	}
}
function printBookmarks(bookmarks) {
 	bookmarks.forEach(function(bookmark) {
	    if (bookmark.children)
	      printBookmarks(bookmark.children);
	  	else
	  		document.getElementById("BookMarksDiv_").insertAdjacentHTML('beforeend','<img src="chrome://favicon/'+bookmark.url+'" > <a href="'+bookmark.url+'">'+bookmark.title+'</a><br />');

  });
}


document.getElementById('utilitiesButton').onclick=function () {
    var div = document.getElementById("utilitiesDiv");
    if(div.style.display=="block") div.style.display="none";
	else div.style.display="block";
window.location.href="chrome://settings/clearBrowserData";
}


//// Watch

  function digitalWatch() {
		var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("digital_watch").innerHTML = hours + ":" + minutes + ":" + seconds;

  }




chrome.alarms.onAlarm.addListener(function(alarm) {
 if(alarm.name === "digitalWatch"){
 	chrome.alarms.create('digitalWatch', { when: Date.now() + 500});
 	digitalWatch();

 	}
})
 chrome.alarms.create('digitalWatch', { when: Date.now() });
