const filterlist:[string] = ["stackoverflow.com"];
export function is_filtered_url(){	
	for (let filter_url of filterlist) {
		if(document.URL.indexOf(filter_url) > -1){
			console.log('No Extension due to filter rule');
			return true;
		}
	}
	return false;
}