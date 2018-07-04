import $ from 'jquery';

export function collapsiblesidebar() {
    $(document).ready(function () {
        $('#dismiss, .overlay').on('click', function () {
            $('#navigation-left').removeClass('navigation-left-collapse');
            $('.overlay').removeClass('active');
        });
        $('#dismiss').on('click', function () {
            $('#navigation-left').addClass('navigation-left-collapse');
            $('#navigation-left').addClass('active');
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
}
