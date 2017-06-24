$(document).ready(function () {
	fire_ajax_fileList();
	 
    $("#btnSubmit").click(function (event) {
        event.preventDefault();     
        if($("#namefile").val() == '' || $("#fileType").val() == '' ||
        		$("#fileOwner").val() == '' || $("#fileDescription").val() == '' ||
        		$("#file").val() == '' ){
        	$("#result").text('Please enter the document details');
        	$("#result").css('color', 'red');
        }else{         	
        	fire_ajax_submit_upload();   
        }
    });
    
    

});

function download(url) {    	
    console.log("remove : ", url);
    event.preventDefault();     
    $.ajax({
        type: "GET",
        url: url,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {                
            console.log("SUCCESS : ", data);
            fire_ajax_fileList();
        },
        error: function (e) {              
            console.log("ERROR : ", e);          
        }
    });
}

function fire_ajax_submit_upload() {
    // Get form
    var form = $('#fileUploadForm')[0];
    var data = new FormData(form);
    data.append("CustomField", "This is some extra data, testing");
    $("#btnSubmit").prop("disabled", true);    
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/api/upload/multi/model",
        data: data,
        //http://api.jquery.com/jQuery.ajax/
        //https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            $("#result").text(data);
            $("#result").css('color', 'green');
            console.log("SUCCESS : ", data);
            fire_ajax_fileList();
            $("#btnSubmit").prop("disabled", false);            

        },
        error: function (e) {
            $("#result").text(e.responseText);
            $("#result").css('text-color', 'red');
            console.log("ERROR : ", e);
            $("#btnSubmit").prop("disabled", false);
        }
    });
    
}


function fire_ajax_fileList() {
	$.ajax({
	    type: "GET",
	    url: "/api/listFiles",
	    //http://api.jquery.com/jQuery.ajax/
	    //https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
	    processData: false, //prevent jQuery from automatically transforming the data into a query string
	    contentType: false,
	    cache: false,
	    timeout: 600000,
	    success: function (response) {
	    	if(response.length == 0){
	    		$('#uploadedFiles').empty();
	    	}else{	      
	        var $ul = $('#uploadedFiles');
	        $ul.empty();
	        $.each(response, function(id, item){            	
                $ul.append( '<tr><td>' + item.fileName + 
		    		            		'</td><td> ' + item.fileOwner + 
		    		            		'</td><td> '  + item.fileType + 
		    		            		'</td><td><a href="/api/download/' + item.id + '">'+ item.fileOriginalName +'</a> </td>' + 
		    		            		'<td><button type="button" Onclick=download("/api/delete/' + item.id + '")  class="btn btn-danger custom-width">Remove</button></td></tr>')
            })
             $ul.append('');
	    	}
	    },
	    error: function (e) {
	        $("#uploadedFiles").text(e.responseText);
	     }
	    });
}