class CalcController {
    constructor(){
        this.entrys = {'multiplicacao': '*', 'divisao': '/', 'soma': '+', 'subtracao': '-', 'porcento': '%', 'ponto': '.', 'Backspace': 'ce', 'Escape': 'ac', 'Enter': 'igual', ',':'.'};
        this._memory = ['0'];
        this._lastOperation = 0;
        this._temp = false;
        this._resetMemory = false;
        this.locale = 'pt-BR';
        this._displayCalcEl = document.getElementById('display');
        this._dateEl = document.getElementById('data');
        this._timeEl = document.getElementById('hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeyboard();
        this.pastFromClipboard();
    }

    initialize(){
        this.setDisplaDateTime();
        setInterval(()=>{this.setDisplaDateTime()}, 30000); 
    }

    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this._memory.join(' ');
        document.body.appendChild(input);
        input.select();
        navigator.clipboard.writeText(input.value);
        input.remove();
    }

    pastFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            if(!isNaN(text)){this.execBtn(text)};
        })
    }

    addEventListenerAll(element, events, func){
        events.forEach(event => {element.addEventListener(event, func, false);})
    }

    getLastValue(i){return this._memory[this._memory.length - i]}
    getLastIndex(i){return this._memory.length - i}

    percent(bool){
        if(bool){this._memory.pop()}
        this.memory = this.getLastValue(1) / 100;
        this.getResult()
    }

    getResult(){
        let result = eval(this._memory.join(' '));
        if(result.toString().length > 10){result = result.toFixed(5)};
        this._memory = [result.toString()]
    }

    dot(lastValue){
        lastValue = lastValue.split('').indexOf('.')
        if(lastValue === -1){return true}
        else{return false}
    }

    setError(){
        this._memory = ['0']
        this.lastOperation = '';
        return 'Error'; 
    }

    addEntry(value){
        
        if (!isNaN(value) && this._memory[0] === '0' && this._memory.length === 1) {
            this._memory.pop();
        } if ((value === '.') && (isNaN(this.getLastValue(1)))) {
            this._memory.push('0.');
        } else if (isNaN(this.getLastValue(1)) && isNaN(value)) {
            if(value === '%'){this.percent(true)}
            else{this.memory = value};  
        } else if (value === '%') {
            this.percent(false)
        } else if (this._memory.length === 0 && !isNaN(value)) {
            this._memory.push(value)
        } else if (!isNaN(this.getLastValue(1)) && (!isNaN(value) || value === '.')) {
            if(value === '.' && !this.dot(this.getLastValue(1))){}
            else {this.memory = this.getLastValue(1) + value}
        } else if (this._temp && isNaN(value)) {
            this.getResult();
            this._memory.push(value);
            this._temp = false;
        } else {
            this._memory.push(value)
            this._temp = true;
        };
        this._resetMemory = false;
    }

    execBtn(value){
        if(value === 'ac'){
            this._memory = ['0'];
            this.lastOperation = ''; 
        }

        else if(value === 'ce'){
            let lastInd = this.getLastIndex(1);
            if(this._memory[lastInd].length === 1){this._memory = ['0']}
            else{this._memory[lastInd] = this._memory[lastInd].slice(0, -1)}
        }

        else if(value === 'igual'){
            if(this.memory.length === 2){this.lastOperation = this.memory[this.getLastIndex(1)] + this.memory[this.getLastIndex(2)]; this._memory.pop(); this._memory.push(this.lastOperation)}
            else if(this.memory.length > 1){this.lastOperation = this.memory[this.getLastIndex(2)] + this.memory[this.getLastIndex(1)]}
            else{this._memory.push(this.lastOperation)};
            this.getResult();
            this._resetMemory = true;
        }

        else if(Object.keys(this.entrys).includes(value)){this.addEntry(this.entrys[value])}

        else{
            if(this._resetMemory && !isNaN(value)){
                this._memory = [];
                this._resetMemory = false;
            };
            this.addEntry(value);
        };

        this.displayCalc = this._memory.join(' ');
    }

    initButtonsEvent(){
        let btns = document.querySelectorAll('#buttons > g, #parts > g');
        btns.forEach((btn,index) => {
            this.addEventListenerAll(btn, ['click', 'drag'], e=>{
                let text = btn.className.baseVal.replace('btn-', '');
                this.execBtn(text);
            });
            this.addEventListenerAll(btn, ['mouseover', 'mouseup', 'mousedown'], e=>{btn.style.cursor = 'pointer'});
        })
    }

    execKey(value, e){
        if(!isNaN(value) || Object.values(this.entrys).includes(value)){
            this.execBtn(value);
        } else if (Object.keys(this.entrys).includes(value)){
            this.execBtn(this.entrys[value])
        } else if (value === 'c' && e.ctrlKey){this.copyToClipBoard()}
    }

    initKeyboard(){
        document.addEventListener('keyup', e=> {
            this.execKey(e.key, e)
        });
    }

    setDisplaDateTime(){
        this.displayCalc = this._memory.join(' ');
        this.displayDate = this.currentDate.toLocaleDateString(this.locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale, {hour: '2-digit', minute:'2-digit'});
    }

    get displayTime(){return this._timeEl}
    set displayTime(value){this._timeEl.innerHTML = value}

    get displayDate(){return this._dateEl}
    set displayDate(value){this._dateEl.innerHTML = value}
    
    get currentDate(){return new Date()}
    set currentDate(value){this._currentDate = value}
    
    get memory(){return this._memory}
    set memory(value){this._memory[this.getLastIndex(1)] = value}
    
    get lastOperation(){return this._lastOperation}
    set lastOperation(value){this._lastOperation = value}

    get displayCalc(){return this._displayCalcEl}
    set displayCalc(value){
        if(value.toString().length > 10 || value === 'Infinity' || value === 'NaN'){
            value = this.setError();
        }
        this._displayCalcEl.innerHTML = value;
    }
};