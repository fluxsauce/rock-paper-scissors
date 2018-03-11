/* global io, gameId */

function showMessage(data) {
  const message = `<div class="alert alert-${data.level} alert-dismissible fade show" role="alert">${
    data.body
  }<button type="button" class="close" data-dismiss="alert" aria-label="Close">` +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' +
    '</div>';

  $('.alerts')
    .append(message)
    .delay(3000)
    .fadeOut(300, () => {
      $(this).remove();
    });
}

$(document).ready(() => {
  if (typeof gameId !== 'undefined') {
    const sio = io.connect('localhost:5000', { query: `gameId=${gameId}` });
    sio.on('message', (data) => {
      showMessage(data);
    });

    sio.on('reload', () => {
      location.reload(); // eslint-disable-line no-restricted-globals
    });
  }
});
