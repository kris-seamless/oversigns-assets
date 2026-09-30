window.oversignsSizeVisualizer = function(helper, data) {
    return {
        drawField: function(parentDiv) {
            parentDiv.empty();

            var wrapper = $('<div class="os-size-visualizer"></div>').appendTo(parentDiv);
            $('<div class="os-size-title">Finished Size Preview</div>').appendTo(wrapper);
            $('<div class="os-size-subtitle">Enter your width and height to preview the finished proportions.</div>').appendTo(wrapper);

            var stage = $('<div class="os-size-stage"></div>').appendTo(wrapper);
            var shape = $('<div class="os-size-shape"></div>').appendTo(stage);
            var widthLabel = $('<div class="os-width-label"></div>').appendTo(shape);
            var heightLabel = $('<div class="os-height-label"></div>').appendTo(shape);
            var productLabel = $('<div class="os-product-label"></div>').appendTo(shape);
            var readout = $('<div class="os-size-readout"></div>').appendTo(wrapper);

            productLabel.text((data && data.product) ? data.product : 'Product');

            function parsePositive(value) {
                var n = parseFloat(value);
                return (isFinite(n) && n > 0) ? n : 0;
            }

            function formatNumber(value) {
                if (!value) return '0';
                return (Math.round(value) === value) ? String(value) : String(parseFloat(value.toFixed(2)));
            }

            function recalc() {
                var width = parsePositive(helper.get_form_value('width_inches'));
                var height = parsePositive(helper.get_form_value('height_inches'));

                widthLabel.text(formatNumber(width) + '"');
                heightLabel.text(formatNumber(height) + '"');
                readout.text('Finished Size: ' + formatNumber(width) + '" × ' + formatNumber(height) + '"');

                if (!width || !height) {
                    shape.css({ width: '180px', height: '180px' });
                    return;
                }

                var maxWidth = 300;
                var maxHeight = 175;
                var minSize = 55;
                var ratio = width / height;
                var visualWidth;
                var visualHeight;

                if (ratio >= 1) {
                    visualWidth = maxWidth;
                    visualHeight = maxWidth / ratio;
                    if (visualHeight > maxHeight) {
                        visualHeight = maxHeight;
                        visualWidth = maxHeight * ratio;
                    }
                } else {
                    visualHeight = maxHeight;
                    visualWidth = maxHeight * ratio;
                    if (visualWidth > maxWidth) {
                        visualWidth = maxWidth;
                        visualHeight = maxWidth / ratio;
                    }
                }

                visualWidth = Math.max(minSize, Math.min(maxWidth, visualWidth));
                visualHeight = Math.max(minSize, Math.min(maxHeight, visualHeight));

                shape.css({
                    width: visualWidth + 'px',
                    height: visualHeight + 'px'
                });
            }

            $(document)
                .off('.oversignsSizeVisualizer')
                .on('input.oversignsSizeVisualizer change.oversignsSizeVisualizer', '[name="width_inches"], [name="height_inches"]', recalc);

            recalc();
        }
    };
};
