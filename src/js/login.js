const CONSTANTS = new Constants();
const inputEmail = $('#user-login-email');
const inputPassword = $('#user-login-password');

// main
$(document).ready(function() {
    loginAttempt();
    removeInvalidInputClass();
});


function loginAttempt() {

    $('.btn-login').on('click', function() {

        $('.btn-login .spinner-border').removeClass('d-none');

        const email = $(inputEmail).val();
        const password = $(inputPassword).val();

        if (email == '') {
            const text = 'Please enter your email.';
            $(inputEmail).closest('.form-group').find('.invalid-feedback').text(text);
            $(inputEmail).addClass('is-invalid');
            return;
        } else if (password == '') {
            const text = 'Please enter your password.';
            $(inputPassword).closest('.form-group').find('.invalid-feedback').text(text);
            $(inputPassword).addClass('is-invalid');
            return;
        }

        const data = {
            function: CONSTANTS.API_FUNCTIONS.loginAttempt,
            email: email,
            password: password,
        }


        $.post(CONSTANTS.API, data, function(response) {
            window.location.href = 'home.php';
            return;
        }).fail(function(response) {
            const text = 'Invalid email and password combination.';
            $(inputPassword).closest('.form-group').find('.invalid-feedback').text(text);
            $(inputEmail).closest('.form-group').find('.invalid-feedback').text('');

            $(inputEmail).addClass('is-invalid');
            $(inputPassword).addClass('is-invalid');
            $('.btn-login .spinner-border').addClass('d-none');
        });

    });

}




function removeInvalidInputClass() {
    $('.form-sm input').on('keydown', function() {
        $('.form-sm input').removeClass('is-invalid');
    });
}



