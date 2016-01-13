var hash = window.location.hash;
if (hash !== null || hash !== '') {
    $('#hs-tab a[href="' + hash + '"]').tab('show');
}

jQuery('input[name="cdn"]').click(function() {
    jQuery(this).select();
});
