window.oversignsSizeVisualizer = function(helper, data) {
    return {
        drawField: function(parentDiv) {
            parentDiv.empty();

            $('<div>')
                .text('OVERSIGNS JAVASCRIPT IS WORKING')
                .css({
                    padding: '24px',
                    margin: '18px 0',
                    background: '#ffe500',
                    border: '4px solid #00a8e8',
                    color: '#171a21',
                    fontSize: '20px',
                    fontWeight: '800',
                    textAlign: 'center'
                })
                .appendTo(parentDiv);
        }
    };
};
