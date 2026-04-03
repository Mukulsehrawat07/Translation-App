const toggleEl = document.querySelector('.toggle-btn')
const translateForm = document.getElementById('translate')
const translateSection = document.getElementById('translate-section')
const toggleTitle = document.getElementById('toggle-title')

const showTranslatedText = false
const showLanguages = true

const state = {
    translatedText: false,
    languages: true,
    submitBtn: true,
}

let textLabel = 'Text to translate 👇'

let translatedText = ''
let originalText = ''

let conversation = JSON.parse(localStorage.getItem('conversation')) || [
    'Select the language you want me to translate into, type your text and hit send!'
]

toggleEl.checked = JSON.parse(localStorage.getItem('toggle')) || false

toggleEl.addEventListener('click', renderSection)

function renderSection() {
    if (toggleEl.checked) {
        renderChatSection()
    } else {
        renderForm()
    }
    localStorage.setItem('toggle', toggleEl.checked)
}

async function translate(text, language) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, language })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Translation failed')
        }

        return data.translation
    } catch (err) {
        console.error('Translation Error:', err)
        throw err
    }
}

async function handleTranslate(e) {
    e.preventDefault()

    if (toggleEl.checked) {
        const translateChatForm = document.getElementById('translate-chat-form')

        const translateChatFormData = new FormData(translateChatForm)

        const text = translateChatFormData.get('chat-text')
        const language = translateChatFormData.get('language')
        conversation.push(text)
        localStorage.setItem('conversation', JSON.stringify(conversation))
        renderChatSection()

        const submitBtn = document.getElementById('chat-submit')
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="loader"></span>'

        try {
            const translation = await translate(text, language)
            conversation.push(translation)
            localStorage.setItem('conversation', JSON.stringify(conversation))
            renderChatSection()
        } catch (err) {
            console.error('Failed to translate:', err)
        }
    } else {
        const submitBtn = document.getElementById('submit')
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="loader"></span>'

        const translateForm = document.getElementById('translate')
    
        const translateFormData = new FormData(translateForm)
    
        const text = translateFormData.get('text')
        const language = translateFormData.get('language')
    
        try {
            const translation = await translate(text, language)
            textLabel = 'Original Text 👇'
            state.languages = false
            state.submitBtn = false
            state.translatedText = true
            originalText = text
            translatedText = translation
            renderForm()
            document.getElementById('text').disabled = true
        } catch (err) {
            console.error('Failed to translate:', err)
        }
    }

}

function resetForm() {
    textLabel = 'Text to translate 👇'
    state.languages = true
    state.submitBtn = true
    state.translatedText = false
    originalText = ''
    renderForm()
    document.getElementById('text').disabled = false
}

function renderForm() {
    let translatedTextBox = `
        <div id="translated-text-box">
            <label class="headings" for="translated-text">Your translation 👇</label>
            <textarea id="translated-text" name="translated-text" disabled>${translatedText}</textarea>
        </div>
    `

    let languages = `
        <div id="language">
            <p class="headings">Select language 👇</p>
            <div id="language-choice">
                <div>
                    <input type="radio" id="french" name="language" value="french" checked>
                    <label for="french">French<span><img src="./assets/fr-flag.png"></span></label>
                </div>
                <div>
                    <input type="radio" id="spanish" name="language" value="spanish">
                    <label for="spanish">Spanish<span><img src="./assets/sp-flag.png"></span></label>
                </div>
                <div>
                    <input type="radio" id="japanese" name="language" value="japanese">
                    <label for="japanese">Japanese<span><img src="./assets/jpn-flag.png"></span></label>
                </div>
            </div>
        </div>
    `

    let button = state.submitBtn ? 
    `
        <button id="submit" type="submit" disabled>Translate</button>
    ` :
    `
        <button id="reset" type="reset">Start Over</button>
    `

    translateSection.innerHTML = `
        <form id="translate">
            <div id="text-box">
                <label class="headings" for="text">${textLabel}</label>
                <textarea id="text" name="text" placeholder="Enter text to translate">${originalText}</textarea>
            </div>
            ${state.translatedText ? translatedTextBox : ''}
            ${state.languages ? languages : ''}
            ${button}
        </form>
    `

    document.getElementById('translate').addEventListener('submit', handleTranslate)
    document.getElementById('translate').addEventListener('reset', resetForm)

    const textarea = document.getElementById('text')
    textarea.addEventListener('input', () => {
        document.getElementById('submit').disabled = textarea.value === ''
    })
}

function renderChatSection() {
    document.getElementById('translate-section').innerHTML = `
        <div id="chat-section">
            <div id="conversation">
                ${conversation.map(text => `<p>${text}</p>`).join('')}
            </div>
            <form id="translate-chat-form">
                <div id="translate-chat">
                    <input id="chat-text" type="text" name="chat-text" />
                    <button id="chat-submit" type="submit" disabled><img src="./assets/send-btn.png" /></button>
                </div>
                <div id="language-choice-chat">
                    <label for="french">
                        <img src="./assets/fr-flag.png">
                        <input type="radio" id="french" name="language" value="french" checked>
                    </label>
                    <label for="spanish">
                        <img src="./assets/sp-flag.png">
                        <input type="radio" id="spanish" name="language" value="spanish">
                    </label>
                    <label for="japanese">
                        <img src="./assets/jpn-flag.png">
                        <input type="radio" id="japanese" name="language" value="japanese">
                    </label>
                </div>
            </form>
        </div>
    `

    document.getElementById('translate-chat-form').addEventListener('submit', handleTranslate)

    const textInput = document.getElementById('chat-text')
    textInput.addEventListener('input', () => {
        document.getElementById('chat-submit').disabled = textInput.value === ''
    })
}

renderSection()