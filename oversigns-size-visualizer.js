/*
 * OVERSIGNS Live Size Visualizer
 * Prototype v1 — Econo Vinyl / PageDNA
 *
 * Purpose:
 * - Reads PageDNA's existing width_inches and height_inches fields
 * - Creates a live proportion preview directly above the Width row
 * - Does NOT change pricing, validation, quantities, proofing, or submitted values
 *
 * Expected PageDNA factory function name:
 *   oversignsSizeVisualizer
 */

(function (global) {
  "use strict";

  function oversignsSizeVisualizer(helper, data) {
    var config = data || {};
    var visualizerId = "oversigns-size-visualizer";
    var styleId = "oversigns-size-visualizer-styles";
    var rowId = "oversigns-size-row";

    function cleanNumber(value) {
      var number = parseFloat(value);
      return Number.isFinite(number) && number > 0 ? number : 1;
    }

    function formatDimension(number) {
      if (Math.round(number) === number) return String(number);
      return String(parseFloat(number.toFixed(2)));
    }

    function addStyles() {
      if (document.getElementById(styleId)) return;

      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
#${rowId} > td {
  padding: 0 0 18px 0 !important;
}

#${visualizerId} {
  width: 100%;
  max-width: 520px;
  margin: 18px auto 22px;
  padding: 24px 28px 28px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e4e8eb;
  border-radius: 14px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

#${visualizerId} .os-size-title {
  margin: 0 0 5px;
  font-size: 21px;
  line-height: 1.2;
  font-weight: 700;
  color: #111;
}

#${visualizerId} .os-size-subtitle {
  margin: 0 0 24px;
  font-size: 13px;
  line-height: 1.35;
  color: #687078;
}

#${visualizerId} .os-size-stage {
  position: relative;
  width: 100%;
  min-height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 38px 46px 42px 62px;
  box-sizing: border-box;
}

#${visualizerId} .os-size-shape {
  position: relative;
  width: 180px;
  height: 180px;
  min-width: 55px;
  min-height: 55px;
  max-width: 300px;
  max-height: 175px;
  background:
    linear-gradient(135deg, rgba(0,174,239,.08), rgba(236,0,140,.05)),
    #f8fafb;
  border: 2px solid #202b33;
  border-radius: 3px;
  box-sizing: border-box;
  transition: width .2s ease, height .2s ease;
}

#${visualizerId} .os-product-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.1px;
  color: #667078;
  text-transform: uppercase;
  text-align: center;
}

#${visualizerId} .os-width-measure {
  position: absolute;
  left: 0;
  right: 0;
  top: -27px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#${visualizerId} .os-width-measure::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 11px;
  height: 2px;
  background: #00aeef;
}

#${visualizerId} .os-width-measure::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 7px;
  height: 8px;
  border-left: 2px solid #00aeef;
  border-right: 2px solid #00aeef;
  box-sizing: border-box;
}

#${visualizerId} .os-width-label {
  position: relative;
  z-index: 2;
  padding: 0 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #111;
}

#${visualizerId} .os-height-measure {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -46px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#${visualizerId} .os-height-measure::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 25px;
  width: 2px;
  background: #ec008c;
}

#${visualizerId} .os-height-measure::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 21px;
  width: 8px;
  border-top: 2px solid #ec008c;
  border-bottom: 2px solid #ec008c;
  box-sizing: border-box;
}

#${visualizerId} .os-height-label {
  position: relative;
  z-index: 2;
  padding: 5px 3px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #111;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

#${visualizerId} .os-size-readout {
  margin-top: 10px;
  font-size: 14px;
  color: #555e65;
}

#${visualizerId} .os-final-size {
  font-weight: 700;
  color: #111;
}

#${visualizerId} .os-size-accent {
  width: 105px;
  height: 4px;
  margin: 18px auto 0;
  background: linear-gradient(
    90deg,
    #00aeef 0%, #00aeef 33%,
    #ec008c 33%, #ec008c 66%,
    #ffe600 66%, #ffe600 100%
  );
  border-radius: 3px;
}

@media (max-width: 600px) {
  #${visualizerId} {
    margin: 14px auto 20px;
    padding: 20px 14px 24px;
  }

  #${visualizerId} .os-size-stage {
    min-height: 230px;
    padding-left: 52px;
    padding-right: 28px;
  }

  #${visualizerId} .os-size-shape {
    max-width: 240px;
    max-height: 150px;
  }
}
      `;
      document.head.appendChild(style);
    }

    function getProductName() {
      var el = document.querySelector("#curr_item_name");
      if (!el) return config.product || "Product";

      var text = (el.textContent || "").replace(/\s*:\s*$/, "").trim();
      return text || config.product || "Product";
    }

    function buildVisualizer(widthRow) {
      var existing = document.getElementById(visualizerId);
      if (existing) return existing;

      var row = document.createElement("tr");
      row.id = rowId;

      var cell = document.createElement("td");
      cell.colSpan = 2;

      var box = document.createElement("div");
      box.id = visualizerId;
      box.innerHTML = `
        <div class="os-size-title">Finished Size Preview</div>
        <div class="os-size-subtitle">
          Enter your width and height below to visualize the finished proportions.
        </div>

        <div class="os-size-stage">
          <div class="os-size-shape">
            <div class="os-width-measure">
              <span class="os-width-label">12"</span>
            </div>
            <div class="os-height-measure">
              <span class="os-height-label">12"</span>
            </div>
            <div class="os-product-label"></div>
          </div>
        </div>

        <div class="os-size-readout">
          Finished Size:
          <span class="os-final-size">12" × 12"</span>
        </div>

        <div class="os-size-accent"></div>
      `;

      cell.appendChild(box);
      row.appendChild(cell);
      widthRow.parentNode.insertBefore(row, widthRow);

      return box;
    }

    function init() {
      var widthInput = document.querySelector('input[name="width_inches"]');
      var heightInput = document.querySelector('input[name="height_inches"]');

      if (!widthInput || !heightInput) return false;

      var widthRow = widthInput.closest("tr");
      if (!widthRow || !widthRow.parentNode) return false;

      addStyles();

      var visualizer = buildVisualizer(widthRow);
      if (!visualizer) return false;

      var shape = visualizer.querySelector(".os-size-shape");
      var widthLabel = visualizer.querySelector(".os-width-label");
      var heightLabel = visualizer.querySelector(".os-height-label");
      var finalSize = visualizer.querySelector(".os-final-size");
      var productLabel = visualizer.querySelector(".os-product-label");

      if (productLabel) {
        productLabel.textContent = getProductName();
      }

      function update() {
        var width = cleanNumber(widthInput.value);
        var height = cleanNumber(heightInput.value);

        var displayWidth = formatDimension(width);
        var displayHeight = formatDimension(height);

        widthLabel.textContent = displayWidth + '"';
        heightLabel.textContent = displayHeight + '"';
        finalSize.textContent = displayWidth + '" × ' + displayHeight + '"';

        var maxWidth = 300;
        var maxHeight = 175;
        var minSize = 55;
        var ratio = width / height;
        var visualWidth;
        var visualHeight;

        if (ratio >= 1) {
          visualWidth = maxWidth;
          visualHeight = maxWidth / ratio;
        } else {
          visualHeight = maxHeight;
          visualWidth = maxHeight * ratio;
        }

        visualWidth = Math.max(minSize, visualWidth);
        visualHeight = Math.max(minSize, visualHeight);

        shape.style.width = visualWidth + "px";
        shape.style.height = visualHeight + "px";
      }

      widthInput.addEventListener("input", update);
      heightInput.addEventListener("input", update);
      widthInput.addEventListener("change", update);
      heightInput.addEventListener("change", update);

      update();

      visualizer._oversignsCleanup = function () {
        widthInput.removeEventListener("input", update);
        heightInput.removeEventListener("input", update);
        widthInput.removeEventListener("change", update);
        heightInput.removeEventListener("change", update);
      };

      return true;
    }

    // Try immediately, then retry briefly in case PageDNA finishes rendering after the factory is called.
    var started = init();

    if (!started) {
      var attempts = 0;
      var timer = global.setInterval(function () {
        attempts += 1;
        if (init() || attempts >= 20) {
          global.clearInterval(timer);
        }
      }, 250);
    }

    // Return a small object so PageDNA-style factory consumers have something usable.
    return {
      destroy: function () {
        var visualizer = document.getElementById(visualizerId);
        if (visualizer && typeof visualizer._oversignsCleanup === "function") {
          visualizer._oversignsCleanup();
        }

        var row = document.getElementById(rowId);
        if (row && row.parentNode) row.parentNode.removeChild(row);
      }
    };
  }

  global.oversignsSizeVisualizer = oversignsSizeVisualizer;
})(window);