document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('soLViaForm');
  var successMsg = document.getElementById('formSuccessMsg');
  var errorMsg = document.getElementById('formErrorMsg');
  if (!form) return; // このスクリプトは contact.html でのみ使用

  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (errorMsg) errorMsg.hidden = true;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中…';
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden = true;
          if (successMsg) successMsg.hidden = false;
        } else {
          throw new Error('送信に失敗しました');
        }
      })
      .catch(function () {
        if (errorMsg) errorMsg.hidden = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '送信する';
        }
      });
  });
});