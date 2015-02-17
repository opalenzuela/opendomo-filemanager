var repositoryURL="https://github.com/jmirasb/opendomo-filemanager/";

var currentItem = -1;
$(function($){
	/* This will be moved as CGI's feature when it's finally stable */
	$("body").on("keydown",function(event){
		console.log("Key pressed: "+ event.which);
		/* NAVIGATION KEYS */
		if (event.which == 39 ) { // Right 
			currentItem++;
		}
		if (event.which == 37 ) { // Left
			currentItem--;
		}	
		if (currentItem == -1) currentItem = $("fieldset li").length -1;
		if (currentItem >=  $("fieldset li").length ) currentItem = 0; 		
		
		try {
			var item = $($("fieldset li")[currentItem]);
			
			/* FUNCTIONAL KEYS */
			if (event.which == 46 ) { // Delete
				item.addClass("deleted");
				setTimeout(function(){
					item.remove();
					if (currentItem == -1) currentItem = $("fieldset li").length -1;
					if (currentItem >=  $("fieldset li").length ) currentItem = 0; 							
					$("fieldset li")[currentItem].className+=" highlight";
				},500);
			}
			
			if (event.which == 13) {  // Enter
				window.location.replace(item.find("a").prop("href"));
			}		
		}catch(e) {
			
		}
				
		$("fieldset li").removeClass("highlight");
		$("fieldset li")[currentItem].className+=" highlight";
	});
	
	initialize_thumbnails();
	$("body").append("<div id='imagepreview' class='folded'>"+
		"<div class='closebanner'></div>"+
		"<div class='behindimage'></div>"+
		"<div id='previewprevious' class='previousimage'></div>"+
		"<div id='previewcurrent' class='currentimage'></div>"+
		"<div id='previewnext' class='nextimage'></div>"+
		"</div>");
		

	$("#imagepreview").on("click",function(event){
		if (event.offsetY < 30) {
			console.log("Closing");
			$("#imagepreview").toggleClass("folded");
			return;
		}
		if (event.offsetX < (document.body.offsetWidth / 2)) { // left
			currentItem--;
			console.log("Previous");
			if (currentItem<0) currentItem=$("fieldset li").length;
			var imgpath = getImageFromItem(currentItem-1);
			
			$("div.behindimage").removeClass("behindimage").addClass("reserved")
				.css("background-image","url('" + imgpath+ "')");
			$("div.nextimage").removeClass("nextimage").addClass("behindimage");         // next -> behind
			$("div.currentimage").removeClass("currentimage").addClass("nextimage");     // current -> next
			$("div.previousimage").removeClass("previousimage").addClass("currentimage");// previous -> current 
			$("div.reserved").removeClass("reserved").addClass("previousimage");         // behind -> previous		
		} else { // Right
			currentItem++;
			console.log("Next");
			if (currentItem> $("fieldset li").length) currentItem=-1;
			var imgpath = getImageFromItem(currentItem+1);
		
			$("div.behindimage").removeClass("behindimage").addClass("reserved")
				.css("background-image","url('" + imgpath+ "')");
			$("div.previousimage").removeClass("previousimage").addClass("behindimage"); // previous -> behind
			$("div.currentimage").removeClass("currentimage").addClass("previousimage"); // current -> previous
			$("div.nextimage").removeClass("nextimage").addClass("currentimage");        // next -> current 
			$("div.reserved").removeClass("reserved").addClass("nextimage");             // behind -> next		
		}
	});
		
});

function initialize_thumbnails() {
	// Processing thumbnails
	item=0;
	$("fieldset li").each(function(item){
		var fullpath = $(this).prop("id");
		$(this).data("itemnumber",item);
		$(this).on("click",zoomTo);
		var link = $(this).find("a");
		var imgpath = link.prop("href");
		link.prop("href","#");
		//link.prop("href","javascript:zoomTo('"+fullpath+"')"); // Disable the link
		if ($(this).hasClass("image")){
			$(this).data("imagepath",imgpath);
			$(this).css("background-image","url('" + imgpath+ "')");
		}
		item++;
	});	
}

function zoomTo(event) {
	currentItem = $(this).data("itemnumber");
	$("#imagepreview").toggleClass("folded");

	var pi = getImageFromItem(currentItem-1);
	var ci = getImageFromItem(currentItem);
	var ni = getImageFromItem(currentItem+1);
	
	$("div.previousimage").css("background-image","url('" +  pi + "')");
	$("div.currentimage").css("background-image","url('" +  ci + "')");
	$("div.nextimage").css("background-image","url('" +  ni + "')");
}

function getImageFromItem(itemNumber) {
	try {
		if ($("fieldset li").length> itemNumber && itemNumber>=0) {
			var item = $("fieldset li")[itemNumber];
			return $(item).data("imagepath");	
		}else{
			return "";
		}
	} catch(e){
		console.log(e.message);
	}
}