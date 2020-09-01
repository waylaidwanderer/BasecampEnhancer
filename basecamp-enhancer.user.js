// ==UserScript==
// @name            Basecamp Enhancer
// @version         1
// @namespace       waylaidwanderer
// @description     Adds useful features to Basecamp.com
// @downloadURL     https://github.com/waylaidwanderer/basecamp-enhancer/raw/master/basecamp-enhancer.user.js
// @include         https://3.basecamp.com/*/buckets/*
// @require         https://code.jquery.com/jquery-3.5.1.min.js
// @require         https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js
// ==/UserScript==

const converter = new showdown.Converter({
    smartIndentationFix: true,
    splitAdjacentBlockquotes: true,
    simplifiedAutoLink: true,
});

let markdownModeEnabled = false;

$(document).on('click', '.markdown-mode', function() {
    // hide all WYSIWYG editor buttons
    $('.trix-button-group:not(.markdown-mode-container)').toggle();

    markdownModeEnabled = !markdownModeEnabled;

    if (markdownModeEnabled) {
        applyMarkdownStylesToInput();
    } else {
        removeMarkdownStylesFromInput();
    }
});

$(document).on('click', 'form.new_comment input', function() {
    markdownModeEnabled = false;
});

$(document).on('click', '.collapsed_content button', function() {
    addMarkdownButton();
});

$(document).ready(function() {
    addMarkdownButton();
});


$(document).on('click', '.markdown-submit', function() {
    console.log($('#comment_content')[0].innerText);
    const html = converter.makeHtml($('#comment_content')[0].innerText).replace(/&amp;nbsp;/gm, '&nbsp;');
    console.log(html);
    $('#comment_content').html(html);
    removeMarkdownStylesFromInput();
    setTimeout(function() {
        $('form.new_comment input').click();
    }, 1);
});

function addMarkdownButton() {
    $('.trix-button-row').each(function() {
        if ($(this).hasClass('markdown-added')) {
            return;
        }
        $(this).prepend(`
<span
    class="markdown-mode-container trix-button-group trix-button-group--text-tools"
    data-trix-button-group="text-tools">
    <button
        type="button"
        class="markdown-mode trix-button trix-button--icon"
        data-trix-attribute="markdown-mode"
        data-trix-key="m"
        title="Markdown Mode"
        tabindex="-1"
        data-trix-active=""
        style="font-weight: 700; text-indent: 0; padding-left: 10px; padding-right: 10px; width: auto;"
    >
        [MD]
    </button>
</span>
        `);
        $(this).addClass('markdown-added');
    });
}

function applyMarkdownStylesToInput() {
    // hide submit button
    $('form.new_comment footer.submit-buttons').hide();
    // replace with our button
    $('form.new_comment').append(`
<footer class="markdown-buttons push_half--top">
    <button type="button" class="btn btn--primary flush--bottom markdown-submit">Add this comment</button>
</footer>
    `);
    // add "active" color to button
    $('.markdown-mode').css('background-color', '#cbeefa');
    // turn input text into monospace font to make it clear we are in MD mode
    $('#comment_content')
        .css('font-family', 'Lucida Console,monospace')
        .css('font-size', '14px');
}

function removeMarkdownStylesFromInput() {
    // show original submit button
    $('form.new_comment footer.submit-buttons').show();
    // hide our buttons
    $('form.new_comment footer.markdown-buttons').remove();
    // remove "active" color from button
    $('.markdown-mode').css('background-color', '');
    // revert monospace font
    $('#comment_content')
        .css('font-family', '')
        .css('font-size', '');
}
