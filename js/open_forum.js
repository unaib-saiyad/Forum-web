// Popover 
$(function () {
  $('.example-popover').popover({
    container: 'body',
    trigger: "hover"
  })
});


// copy button of code snippet
function copy_code_snippet() {
  var text = document.getElementById('code-snippet').innerHTML;
  text.select();
  document.execCommand('copy');
}


// trigger the tags to text
function post_text_process() {
  var text = $('#post-text-input').val();
  var bold = false;
  var italic = false;
  var heading = false;
  var list = false;
  var code = false;
  var list_element_trigger = false;
  var process_text = '';

  var links = [];
  var desc = [];

  for (var i = 0; i < text.length; i++) {
    if (text[i] === '[' && !code) {
      sliced_text = text.slice(i + 1, text.length);
      var temp_disc = '';
      for (var j = 0; j < sliced_text.length; j++) {
        if (sliced_text[j] === '[') {
          break;
        }
        else if (sliced_text[j] === ']' && sliced_text[j + 1] === '[' && sliced_text[j + 2] === 'l' && sliced_text[j + 3] === 'i' && sliced_text[j + 4] === 'n' && sliced_text[j + 5] === 'k' && sliced_text[j + 6] === ':') {
          j = j + 7;
          var link = '';
          for (var k = j; k < sliced_text.length; k++) {
            if (sliced_text[k] !== ']') {
              link = link + sliced_text[k];
            }
            else {
              if (link.slice(0, 7) !== 'http://' && link.slice(0, 8) !== 'https://') {
                var temp = link;
                link = 'http://' + temp;
              }
              links.push(link);
              desc.push(temp_disc);
              break;
            }
          }
        }
        else {

          temp_disc = temp_disc + sliced_text[j];
        }
      }
    }


    if (text[i] === '#' && !code) {
      if (!italic) {
        italic = true;
        process_text = process_text + '<i>';
      }
      else {
        italic = false;
        process_text = process_text + '</i>';
      }
    }

    else if (text[i] === '*' && text[i + 1] === '*' && text[i + 2] === '*' && !code) {
      if (!bold) {
        i = i + 2;
        bold = true;
        process_text = process_text + '<b>';
      }
      else {
        i = i + 2;
        bold = false;
        process_text = process_text + '</b>';
      }
    }

    else if (text[i] === '+' && text[i + 1] === '+' && text[i + 2] === '+' && !code) {
      if (!heading) {
        i = i + 2;
        heading = true;
        process_text = process_text + '<h2>';
      }
      else {
        heading = false;
        i = i + 2;
        process_text = process_text + '</h2>';
      }
    }

    else if (list_element_trigger && text[i] === '\n') {
      list_element_trigger = false;
      process_text = process_text + '</li>';
      if (text[i + 1] !== '-' && text[i + 2] !== ' ') {
        process_text = process_text + '</ul>';
        list = false;
      }
    }

    else if (text[i] === '-' && text[i + 1] === ' ') {
      i = i + 1;
      if (!list) {
        list = true;
        process_text = process_text + '<ul><li>';
      }
      else if (list) {
        process_text = process_text + '<li>';
      }
      list_element_trigger = true;
    }

    else if (text[i] === '`') {
      if (!code) {
        code = true;
        process_text = process_text + '<pre><code>';
      }
      else {
        code = false;
        process_text = process_text + '</code></pre>';
      }
    }

    else {
      process_text = process_text + text[i];
    }
  }


  if (links.length !== 0) {
    var start_index = 0;
    var end_index = 0;
    var link_counter = 0;
    var open_brace = true;
    for (var i = 0; i < process_text.length; i++) {
      if (process_text[i] === '[' && open_brace) {
        start_index = i;
        open_brace = false;
      }
      else if (process_text[i] === ']' && process_text[i + 1] === '[' && process_text[i + 2] === 'l' && process_text[i + 3] === 'i' && process_text[i + 4] === 'n' && process_text[i + 5] === 'k' && process_text[i + 6] === ':' && open_brace === false) {
        i = i + 6;
        for (var j = i; j < process_text.length; j++) {
          if (process_text[j] === ']') {
            end_index = j + 1;
            process_text = process_text.replace(process_text.slice(start_index, end_index), '<a href="' + links[link_counter] + '">' + desc[link_counter] + '</a>');
            link_counter = link_counter + 1;
            open_brace = true;
            break;
          }
        }
      }
      else if (process_text[i] == ']') {
        open_brace = true;
      }
    }
  }

  $('#post-text-output').html(process_text);
}


// Converting into Bold
function convert_bold() {
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  var process_text = '';
  if (text[selectStart - 1] === '*' && text[selectStart - 2] === '*' && text[selectStart - 3] === '*' && text[selectEnd] === '*' && text[selectEnd + 1] === '*' && text[selectEnd + 2] === '*') {
    process_text = text.slice(0, selectStart - 3) + text.slice(selectStart, selectEnd) + text.slice(selectEnd + 3, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart - 3, selectEnd - 3);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      var process_text = text.slice(0, selectStart) + '***Strong text***' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 3, selectStart + 14);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "***" + text.slice(selectStart, selectEnd) + "***" + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 3, selectEnd + 3);
      });
      element.focus();
    }
  }
}


// Convert Italic
function convert_italic() {
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  var process_text = '';
  if (text[selectStart - 1] === '#' && text[selectEnd] === '#') {
    process_text = text.slice(0, selectStart - 1) + text.slice(selectStart, selectEnd) + text.slice(selectEnd + 1, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart - 1, selectEnd - 1);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      process_text = text.slice(0, selectStart) + '#Italic text#' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectStart + 12);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "#" + text.slice(selectStart, selectEnd) + "#" + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectEnd + 1);
      });
      element.focus();
    }
  }
}


// Converting into heading
function convert_heading() {
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  var process_text = '';
  if (text[selectStart - 1] === '+' && text[selectStart - 2] === '+' && text[selectStart - 3] === '+' && text[selectEnd] === '+' && text[selectEnd + 1] === '+' && text[selectEnd + 2] === '+') {
    process_text = text.slice(0, selectStart - 3) + text.slice(selectStart, selectEnd) + text.slice(selectEnd + 3, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart - 3, selectEnd - 3);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      var process_text = text.slice(0, selectStart) + '+++Heading text+++' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 3, selectStart + 15);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "+++" + text.slice(selectStart, selectEnd) + "+++" + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 3, selectEnd + 3);
      });
      element.focus();
    }
  }
}


// Hyperlink process
function add_hyperlink() {
  var link = $('#add-link').val();
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  process_text = '';
  if (link.slice(0, 7) !== 'http://' && link.slice(0, 8) !== 'https://') {
    var temp = link;
    link = 'http://' + temp;
  }
  if (text[selectStart - 1] === '[' && text.slice(selectEnd, selectEnd + 7) === '][link:' && text.slice(selectEnd + 7, selectEnd + 7 + link.length) === link) {
    process_text = text.slice(0, selectStart - 1) + text.slice(selectStart, selectEnd) + text.slice(selectEnd + 8 + link.length, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart - 1, selectEnd - 1);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      var process_text = text.slice(0, selectStart) + '[enter-link-description-here][link:' + link + ']' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectStart + 28);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "[" + text.slice(selectStart, selectEnd) + "][link:" + link + ']' + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectEnd + 1);
      });
      element.focus();
    }
  }
}


function convert_list() {
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  var process_text = '';
  if (text[selectStart - 1] === ' ' && text[selectStart-2] === '-') {
    process_text = text.slice(0,selectStart-2) + text.slice(selectStart,selectEnd) + text.slice(selectEnd, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart-2, selectEnd-2);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      process_text = text.slice(0, selectStart) + '- List Item' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 2, selectStart + 11);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "- " + text.slice(selectStart, selectEnd) + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart+2, selectEnd+2);
      });
      element.focus();
    }
  }
}


// Code Button Process
function add_code() {
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  process_text = '';
  if (text[selectStart - 1] === '`' && text[selectEnd] === '`') {
    process_text = text.slice(0, selectStart - 1) + text.slice(selectStart, selectEnd) + text.slice(selectEnd + 1, text.length);
    $('#post-text-input').val(process_text);
    post_text_process();
    var element = $('#post-text-input').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(selectStart - 1, selectEnd - 1);
    });
    element.focus();
  }
  else {
    if (selectStart === selectEnd) {
      process_text = text.slice(0, selectStart) + '`Write your code here`' + text.slice(selectStart, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectStart + 21);
      });
      element.focus();
    }
    else {
      var process_text = text.slice(0, selectStart) + "`" + text.slice(selectStart, selectEnd) + "`" + text.slice(selectEnd, text.length);
      $('#post-text-input').val(process_text);
      post_text_process();
      var element = $('#post-text-input').get(0);
      element.addEventListener('focus', function () {
        element.setSelectionRange(selectStart + 1, selectEnd + 1);
      });
      element.focus();
    }
  }
}


// Display the output text
$('#post-text-output').on('DOMSubtreeModified', function () {
  var text = $('#post-text-output').html();
  if (text.length > 0) {
    $("#post-text-output").removeClass("d-none");
  }
  else {
    $("#post-text-output").addClass("d-none");
  }
});


// Hyperlink-display
function hyperlink_block() {
  var link = $('#add-link').val();
  var text = $('#post-text-input').val();
  var selectStart = $('#post-text-input').get(0).selectionStart;
  var selectEnd = $('#post-text-input').get(0).selectionEnd;
  if (link.slice(0, 7) !== 'http://' && link.slice(0, 8) !== 'https://') {
    var temp = link;
    link = 'http://' + temp;
  }
  if (text[selectStart - 1] === '[' && text.slice(selectEnd, selectEnd + 7) === '][link:' && text.slice(selectEnd + 7, selectEnd + 7 + link.length) === link) {
    add_hyperlink();
  }
  else if ($('#add-hyperlink-div').hasClass('d-none')) {
    $("#add-hyperlink-div").removeClass("d-none");
    $("#add-hyperlink-div").addClass("d-block");
    $("#textarea-div").removeClass("d-block");
    $("#textarea-div").addClass("d-none");
    $('#add-link').val('https://');
    var element = $('#add-link').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(0, 8);
    });
    element.focus();
  }
  else {
    $("#add-hyperlink-div").removeClass("d-block");
    $("#add-hyperlink-div").addClass("d-none");
    $("#textarea-div").removeClass("d-none");
    $("#textarea-div").addClass("d-block");
  }
}


// File-Block-display
function filelink_block() {
  if ($('#add-file-div').hasClass('d-none')) {
    $("#add-file-div").removeClass("d-none");
    $("#add-file-div").addClass("d-block");
    $("#textarea-div").removeClass("d-block");
    $("#textarea-div").addClass("d-none");
    $('#add-link').val('https://');
    var element = $('#add-link').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(0, 8);
    });
    element.focus();
  }
  else {
    $("#add-file-div").removeClass("d-block");
    $("#add-file-div").addClass("d-none");
    $("#textarea-div").removeClass("d-none");
    $("#textarea-div").addClass("d-block");
  }
  if ($('#add-file-optional-methods').hasClass('d-none')){
    if(!$('#file-option').hasClass('d-none')){
      $("#file-option").addClass("d-none");
    }
    else if(!$('#link-option').hasClass('d-none')){
      $("#link-option").addClass("d-none");
    }
    $("#add-file-optional-methods").removeClass("d-none");
  }
}

function file_uploading(){
  
  if ($('#file-option').hasClass('d-none')){
    $("#file-option").removeClass("d-none");
    $("#add-file-optional-methods").addClass("d-none");
  }
}
function link_uploading(){
  if ($('#link-option').hasClass('d-none')){
    $("#link-option").removeClass("d-none");
    $("#add-file-optional-methods").addClass("d-none");
  }
  $('#link-option').val('https://');
    var element = $('#link-option').get(0);
    element.addEventListener('focus', function () {
      element.setSelectionRange(0, 8);
    });
    element.focus();
}

// Reload access
window.onbeforeunload = function () {
  return 'Are you sure you want to leave?';
  post_text_process;
}


// Active-Button
$('a.link').click(function () {
  $('a.link').removeClass('active');
  $(this).addClass('active');
});

  // Backward Button
