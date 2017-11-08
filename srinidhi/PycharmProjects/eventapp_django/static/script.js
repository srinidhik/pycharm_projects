function add() {                                    // Onclick add button with ajax calls
        var name = $('#name').val();
        var date = $('#date').val();
        var info = $('#info').val();
        var cities = $('#cities').val();
        var re = /^[a-z.A-Z ]+[a-z.A-Z.0-9]+[ .]*$/;

        if(re.test(name) && date != "" && re.test(info)  && /^\w+$/.test(cities)) {

            $.ajax({
                type:'POST',
                url:"/add",
                data:{
                    'name':name, 'date':date, 'info':info, 'cities':cities
                },
                success:function (response_data) {
                    alert(response_data);
                    $('#add_form')[0].reset();
                },
                error:function () {
                    alert("Something wrong");
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
        $.ajax({
            type: "POST",
            url: "/city",
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

    //bydate_script
    function bydate(){
        var date=$('#date').val();
        $.ajax({
            type: "POST",
            url: "/date",
            data: {'date': date},
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
        var date = $('#date').val();
        var city = $('#city').val();
        $.ajax({
            type: "POST",
            url: "/datecity",
            data: {'date': date, 'city': city},
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


    //daterange_script
   function bydate_range(){
       var date1 = $('#from').val();
       var date2 = $('#to').val();
        $.ajax({
            type: "POST",
            url: "/date_range",
            data: {'fromdate': date1, 'todate': date2},
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

      //search_script

    function search() {
            $.post("/search", $('form').serializeArray(), function (data) {
                   if(data=="please select a name from list!"){
                        alert(data);
                   }
                   else{
                        $('#ermsg').html(data);
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

 function Check(val){
 var element=document.getElementById('city1');
 if(val=='other')
   element.style.display='block';
 else
   element.style.display='none';
}