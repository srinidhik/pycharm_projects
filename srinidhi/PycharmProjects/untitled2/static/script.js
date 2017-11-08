

function setSelectedIndex(s, v) {

    for ( var i = 0; i < s.options.length; i++ ) {

        if ( s.options[i].text == v ) {

            s.options[i].selected = true;

            return;

        }

    }

}

 function Check(val){
 var element=document.getElementById('city');
 if(val=='other')
   element.style.display='block';
 else
   element.style.display='none';
}