const handleAccept = () => {
  // 1. Make Google's elements visible
  document.querySelectorAll('.goog-te-combo, .goog-te-menu-frame')
    .forEach(el => {
      el.style.display = 'block';
      el.style.visibility = 'visible';
    });

  // 2. Wait for Google's elements to stabilize
  setTimeout(() => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = state.lang;
      select.dispatchEvent(new Event('change'));
      
      // 3. Final cleanup after translation
      setTimeout(() => {
        document.querySelectorAll('.goog-te-banner-frame')
          .forEach(el => el.style.display = 'none');
      }, 500);
    }
  }, 300);
};
