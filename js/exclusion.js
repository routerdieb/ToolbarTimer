const filterlist = ["stackoverflow.com"];
function is_filtered_url(){	
	for (filter_url of filterlist) {
		if(document.URL.indexOf(filter_url) > -1){
			return true;
		}
	}
	return false;
}