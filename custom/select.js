const getTemplate = (data = [], placeholder) => {
    const counter = 0
    const text = placeholder ?? 'Код ОКРБ'
    const items = data.map(item => {
        return `
        <li class="select_item" data-type="item" data-id="${item.id}">${item.value}</li>
        `
    })
    return `
    <div class="up">
    <h3 class="h_title">Тендеры в роли
    <span class="h_span">Показать выбранное( ${counter} )</span>
    </h3>
    </div>
    <div class="select_title" data-type="input">
        <span data-type="value">${text}</span>
    </div>
    <div class="select_drop">
        <ul class="select_list">
            ${items.join('')}
        </ul>
    </div>
`
}

export class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector)
        this.options = options
        this.selectId = null

        this.#render()
        this.#setup()
    }

    #render() {
        const {placeholder, data} = this.options
        this.$el.classList.add('select')
        this.$el.innerHTML = getTemplate(data, placeholder)
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$value = this.$el.querySelector('[data-type="value"]')
    }

    clickHandler(event) {
        const {type} = event.target.dataset
        
        if (type === 'input') {
            this.toggle()
        }
        else if (type === 'item') {
            const id = event.target.dataset.id
            this.select(id)
        }
    }

    get isOpen() {
        return this.$el.classList.contains('visible')
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectId)
    }

    select(id) {
        this.selectId = id
        this.$value.textContent = this.current.value
        this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
            el.classList.remove('selected')
        });
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')
        this.options.onSelect ? this.options.onSelect(this.current) : null

        this.close()
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    open() {
        this.$el.classList.add('visible')
    }

    close() {
        this.$el.classList.remove('visible')
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }
}