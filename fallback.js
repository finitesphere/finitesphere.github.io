function isWebGLAvailable() {
    try {
        var canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && (
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!isWebGLAvailable()) {
        document.getElementById('static-sphere').style.display = 'block';
    }
});
