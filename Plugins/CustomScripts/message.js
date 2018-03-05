

function hideTop( id ) {
    $('#'+id).animate({
        opacity: 0,
        right: '-20'
    }, 500, function () {
        $(this).hide();
    });
}

function showError( str) {
    $('#alertMessage').addClass('error').html(str).stop(true, true).show().animate({
        opacity: 1,
        right: '0'
    }, 1000, function () {
        $(this).hide();
    });
}

function showWarning( str) {
    $('#alertMessage').addClass('warning').html(str).stop(true, true).show().animate({
        opacity: 1,
        right: '0'
    }, 1000, function () {
        $(this).hide();
    });
}

function showInfo(  str) {
    $('#alertMessage').addClass('info').html(str).stop(true, true).show().animate({
        opacity: 1,
        right: '0'
    },1000, function () {
        $(this).hide();
    });
}

function showSuccess( str) {
    $('#alertMessage').addClass('success').html(str).stop(true, true).show().animate({
        opacity: 1,
        right: '0'
    }, 1000, function () {
        $(this).hide();
    });

}
