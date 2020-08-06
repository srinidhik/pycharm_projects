function folderDetails() {

    var excelUpload = $('#excelUploadForm')[0];
    var excelData = new FormData(excelUpload);
    var folderType = $("#zipFolderType").val();
    var curtainType = $("#zipCurtainType").val();
    var folderFile = $("#zipFileCurtain").val();
    var sheetFile = $("#sheetFileCurtain").val();
    var swatchFlag = $("#swatchFlag").val();



    if (((folderType == "curtains" && curtainType) || (folderType == "shades")) && folderFile && sheetFile && swatchFlag) {
        $("#zipUploadFailed").html(" ");
        $("#zipNote").html(" ");
        $("#zipUploadResult").html(" ");
        var callbacks = {};

        ajaxindicatorstart("Uploading Data");

        callbacks['success'] = function (response) {

            var successData = response.successData;
            var failed = response.failed;

            var successCount = "Success Data Count:";
            $.each(successData, function (i, val) {
                successCount = successCount + "<br>" + i + " = " + val;
            });
            $("#zipUploadResult").html(successCount);


            var failedHtml = "Failed Data:";
            $.each(failed, function (key, val) {
                failedHtml = failedHtml + "<br>" + key + ": ";
                for (var k = 0; k < val.length; k++)
                    failedHtml = failedHtml + JSON.stringify(val[k]) + "<br><hr>";
            });


            $("#zipUploadFailed").html(failedHtml);


            ajaxindicatorstop();
            excelUpload.reset();
            $(".option-field").hide();
            $("#curtaintypes").hide();
            $("#shadetypes").hide();
            defaultThemeDialog("Data Uploaded Succesfully!!", 15, null, null, "green");

        };
        callbacks['error'] = function (error) {
            ajaxindicatorstop();
            defaultThemeDialog(error.responseJSON, 15, null, null, "red");
        };

        window.kustome.getResponse('POST', '/api/custom-curtains/upload-from-excel-zip', excelData, callbacks, true);
    }
    var text = null;
    if (!folderFile) {
        text = "Choose Zip File";
    } else if (!sheetFile) {
        text = "Choose Sheets File";
    }else if(!swatchFlag){
        text = "Choose Image Type";
    } else if (!folderType) {
        text = "Choose Type Option";
    } else if (folderType == "curtains" && !curtainType) {
        text = "Choose Sub-Type Option";
    }
    if (text != null) {
        defaultThemeDialog(text, 15, null, null, "red");
    }
}

function chooseType() {
    var folderType = $("#zipFolderType").val();
    var swatchFlag = $("#swatchFlag").val();
    var isFabric = $("#isFabric").val();
    if (isFabric == 'true') {
        $("#swatchFlag").find('[value="true"]').prop("disabled",true);
        $("#zipCurtainType").find('[value="zoom"]').prop("disabled",true);
    }
    else{
        $("#swatchFlag").find('[value="true"]').prop("disabled",false);
        $("#zipCurtainType").find('[value="zoom"]').prop("disabled",false);
    }
    if (folderType == "curtains") {
        $("#curtaintypes").show();
        $("#shadetypes").hide();
        $(".option-field").show();
    }
    else{
        $(".option-field").hide();
        $("#curtaintypes").hide();
        $("#shadetypes").show();
    }
}

function curtainBulkUploadInfo(){
    defaultThemeDialog($('#uploadFormat').html(), 80, 'Upload Format');
}

function updateCurtainsParameters() {
    var url = '/api/custom-curtains/curtains-update-parameter';
    var file = new FormData($('#updateParameter')[0]);
    var callbacks = {};
    callbacks["success"] = function (data) {
        alert(data);
    };
    callbacks["error"] = function (error) {
        alert(error.responseJSON);
    };
    window.kustome.getResponse('POST', url, file, callbacks, true);
}

function curtainEditInfo(){
    defaultThemeDialog($('#bulkEditFormat').html(), 40, 'Update Keys');
}