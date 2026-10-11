(function () {
    var root = document.documentElement;
    var btn = document.getElementById('toggle');
    if (!btn) return;
    function isLight() { return root.getAttribute('data-theme') === 'light'; }
    btn.setAttribute('aria-pressed', isLight());
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var next = isLight() ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        btn.setAttribute('aria-pressed', next === 'light');
        try { localStorage.setItem('theme', next); } catch (err) { }
    });
})();
