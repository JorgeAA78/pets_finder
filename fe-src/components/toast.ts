export function showToast(message: string, type: 'success' | 'error' = 'success') {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    
    setTimeout(() => {
        toast?.classList.add('active');
    }, 10);
    
    setTimeout(() => {
        toast?.classList.remove('active');
    }, 3000);
}
