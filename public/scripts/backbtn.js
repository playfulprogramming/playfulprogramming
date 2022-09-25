/* AFTER CHANGING THIS FILE, PLEASE MANUALLY MINIFY IT AND PUT INTO backbtn.min.js */
/* TODO: Add minifier to build script */
window.onload = () => {
    const backBtn = document.querySelector('#backbtn');

    let hasHistory = false;
    window.addEventListener('beforeunload', () => {
        hasHistory = true;
    })

    backBtn.addEventListener('click', () => {
        if (!document.referrer) {
            // This is the first page the user has visited on the site in this session
            window.location.href = '/';
            return;
        }
        history.back();

        // User cannot go back, meaning that we're at the first page of the site session             
        setTimeout(() => {
            if (!hasHistory){
                window.location.href = "/";
            }
        }, 200);
    })
}