$(function() {
    $('.comment').on('click', function() {
        var $this = $(this);
        var commentId = $this.data('commentId');
        var toId = $this.data('toId');

        if($('#commentId').length > 0) {
            $('#commentId').val(commentId);
        }
        else {
            $('<input>').attr({
                id: 'commentId',
                type: 'hidden',
                name: 'commentId',
                value: commentId
            }).appendTo('#commentForm');
        }

        if($('#toId').length > 0) {
            $('#toId').val(toId);
        }
        else {
            $('<input>').attr({
                id: 'toId',
                type: 'hidden',
                name: 'toId',
                value: toId
            }).appendTo('#commentForm');
        }
    })
})