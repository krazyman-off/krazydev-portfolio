(function () {
    var L = "<div style=position:fixed;inset:0;z-index:99999;background:#07070b;color:#ff2d55;font-family:monospace;font-size:13px;padding:20px;letter-spacing:1px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.8>Access denied — inspection n'est pas autorisée sur ce site.<br>Accès refusé 403.</div>";
    if (top !== self) { document.documentElement.innerHTML = ""; return; }
    function block(e) { e.preventDefault(); }
    ["contextmenu", "selectstart", "dragstart", "copy", "cut", "paste"].forEach(function (ev) {
        document.addEventListener(ev, block);
    });
    document.addEventListener("keydown", function (e) {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].indexOf(e.key.toUpperCase()) !== -1) ||
            (e.ctrlKey && e.key.toLowerCase() === "u")
        ) {
            e.preventDefault();
            e.stopPropagation();
            try { document.body.innerHTML = L; } catch (err) {}
        }
    });
    var last = Date.now();
    function probe() {
        var now = Date.now();
        if (now - last > 130) {
            var el = document.createElement("div");
            el.id = "___kzguard___";
            el.style.cssText = "width:100px;height:100px;position:fixed;z-index:-9999;left:-9999px;top:0px";
            document.body.appendChild(el);
            var w = el.offsetWidth;
            document.body.removeChild(el);
            if (w === 0) {
                try { document.body.innerHTML = L; } catch (err) {}
            }
        }
        last = now;
        setTimeout(probe, 700);
    }
    setTimeout(probe, 1500);
})();