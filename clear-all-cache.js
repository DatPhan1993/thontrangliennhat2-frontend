// Clear all session storage
console.log('🧹 Clearing all sessionStorage...');

Object.keys(sessionStorage).forEach(key => {
    console.log('Removing from sessionStorage:', key);
    sessionStorage.removeItem(key);
});

console.log('✅ All sessionStorage cleared!');

// Also clear any cached data in React app
if (window.location.pathname.includes('thontrangliennhat')) {
    console.log('🔄 Reloading page to apply changes...');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
} 