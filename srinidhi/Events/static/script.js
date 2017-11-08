function getCookie(name) {                                // get csrf-token , this method is used before every ajax call
                var cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

function add() {                                    // Onclick add button with ajax calls
        var name = $('#name').val();
        var date = $('#date').val();
        var info = $('#info').val();
        var cities = $('#cities').val();
        var city_other = $('#city1').val();
        var re = /^[a-z.A-Z ]+[a-z.A-Z.0-9]+[ .]*$/;

        if(re.test(name) && date != "" && re.test(info)  && /^\w+$/.test(cities)) {

            var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            $.ajax({
                type:'POST',
                url:"/add",
                data:{
                    'name':name, 'date':date, 'info':info, 'cities':cities, 'city1': city_other
                },
                success:function (response_data) {
                    alert(response_data);
                    $('#add_form')[0].reset();
                },
                error:function () {
                    alert("Something wrong")
                }
            });


        }
        else{
            alert("One or more invalid fields.");

        }
    }
function Check(val){
 var element=document.getElementById('city1');
 if(val=='other')
   element.style.display='block';
 else
   element.style.display='none';
}

      //search_script
function search() {
        var event_is = $('#event_name').val()
        var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        $.post("/search",
            {'event_name':event_is},
            function (data) {
               if(data=="please select a name from list!"){
                   $('#search_result').slideUp();
                   alert(data);

               }
               else{
                    $('#search_result').html(data);
                    $('#search_result').slideDown();
                    }
           });
       }


function updat() {
    var event_id = $('#event_id').val();
    var upd_name = $('#upd_name').val();
    var upd_date = $('#upd_date').val();
    var upd_info = $('#upd_info').val();
    var city = $('#city').val();
    var re = /^[a-z.A-Z ]+[a-z.A-Z.0-9]+[ .]*$/;

    if(re.test(upd_name) && upd_date != "" && re.test(upd_info)  && /^\w+$/.test(city)){
        var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        $.post("/update",
            {'id': event_id, 'upd_name':upd_name, 'upd_date':upd_date, 'upd_city':city, 'upd_info':upd_info},
                function (response) {
                    if(response == "1"){
                        location.reload();
                        alert("Event data updated");
                    }
                    else{
                        alert(response);
                    }
                });

    }
    else{
        alert("One or more fields invalid")
    }
}


function del() {
        var event_id = $('#event_id').val();
        var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        $.post("/delete",
            {'id':event_id},
        function (response) {
            if(response == event_id){
                alert("no id");
            }
            else{
                location.reload();
                alert("deleted");
                }
        });
        }

function setSelectedIndex(s, v) {

    for ( var i = 0; i < s.options.length; i++ ) {

        if ( s.options[i].text == v ) {

            s.options[i].selected = true;

            return;

        }

    }

}
    //bydate_script
    function bydate(){
        var date=$('#date1').val();

        if( date != "") {

            var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function (xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            $.ajax({
                type: "POST",
                url: "/by_date",
                data: {'date': date},
                success: function (data) {
                    if (data == 'no event found') {
                        alert(data);
                    }
                    else {
                        $("#message").html(data);
                    }
                },
                error: function () {
                    alert("Something wrong")
                }

            });
        }
            else{
            alert("One or more invalid fields.");

        }
    }

        //bycity_script
    function bycity(){
        var city=$('#city').val();

        var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

        $.ajax({
            type: "POST",
            url: "/by_city",
            data: {'city': city},
            success: function (data) {
                if (data == 'no event found') {
                    alert(data);
                }
                else {
                    $("#message").html(data);
                }
            },
                error:function () {
                    alert("Something wrong")
                }

        });
    }

    //date_city_script
    function date_city(){
        var date=$('#date1').val();
        var city=$('#city1').val();
        if( date != "") {
            
        var csrftoken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });


            $.ajax({
            type: "POST",
            url: "/by_date_and_city",
            data: {'date': date, 'city': city},
            success: function (data) {
                if (data == 'no event found') {
                    alert(data);
                }
                else {
                    $("#message").html(data);
                }
            },
            error: function () {
                alert("Something wrong")
            }

        });
    }
        else{
            alert("One or more invalid fields.");

        }
    }

    //daterange_script
   function by_date_range(){
       var date1 = $('#date3').val();
       var date2 = $('#date2').val();

       if (date1!=""&&date2!='') {
           var csrftoken = getCookie('csrftoken');
           $.ajaxSetup({
               beforeSend: function (xhr) {
                   if (!this.crossDomain) {
                       xhr.setRequestHeader("X-CSRFToken", csrftoken);
                   }
               }
           });


           $.ajax({
               type: "POST",
               url: "/by_date_range",
               data: {'date1': date1, 'date2': date2},
               success: function (data) {


                   if (data == 'no event found') {
                       location.reload();
                       alert(data);

                   }
                   else {
                       $("#message").html(data);
                   }
               },
               error: function () {
                   alert("Something wrong");
               }

           });
       }
        else{
            alert("One or more invalid fields.");

        }
    }







