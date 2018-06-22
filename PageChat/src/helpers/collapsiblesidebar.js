import $ from 'jquery';

export function collapsiblesidebar() {
    $(document).ready(function () {
        $('#dismiss, .overlay').on('click', function () {
            $('#sidebar').removeClass('sidebar-collap');
            $('.overlay').removeClass('active');
        });
        $('#dismiss').on('click', function () {
            $('#sidebar').addClass('sidebar-collap');
            $('#sidebar').addClass('active');
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
}
