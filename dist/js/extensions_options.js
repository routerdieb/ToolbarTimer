function save_options() {
    var sites = document.getElementById('Sites_ta').value;
    chrome.storage.sync.set({
        sites: sites
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Sites saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    // Use default for sites
    chrome.storage.sync.get({
        sites: '',
    }, function (items) {
        if (items.sites != '') {
            document.getElementById('Sites_ta').value = items.sites;
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);