window.oversignsPageDNATest = function(helper, data) {
    return {
        drawField: function(parentDiv) {

            console.log("OVERSIGNS: PageDNA Custom JS loaded");

            parentDiv.empty();

            $('<div>')
                .text('OVERSIGNS JAVASCRIPT IS WORKING')
                .css({
                    padding: '20px',
                    margin: '15px 0',
                    background: '#ffe500',
                    border: '3px solid #00a8e8',
                    color: '#171a21',
                    fontSize: '18px',
                    fontWeight: '700',
                    textAlign: 'center'
                })
                .appendTo(parentDiv);
        }
    };
};
