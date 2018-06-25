import $ from 'jquery';

export function collapsiblesidebar() {
    $(document).ready(function () {
        $('#dismiss, .overlay').on('click', function () {
            $('#navigation-right').removeClass('navigation-right-collapse');
            $('.overlay').removeClass('active');
        });
        $('#dismiss').on('click', function () {
            $('#navigation-right').addClass('navigation-right-collapse');
            $('#navigation-right').addClass('active');
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
}
