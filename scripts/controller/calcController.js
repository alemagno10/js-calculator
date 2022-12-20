class CalcController {
    constructor(){
        this.entrys = {'multiplicacao': '*', 'divisao': '/', 'soma': '+', 'subtracao': '-', 'porcento': '%', 'ponto': '.'};
        this._memory = [];
        this._temp = false;
        this._resetMemory = false;
        this.locale = 'pt-BR';
        this._displayCalcEl = document.getElementById('display');
        this._dateEl = document.getElementById('data');
        this._timeEl = document.getElementById('hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
    }

    initialize(){
        this.setDisplaDateTime();
        setInterval(()=>{this.setDisplaDateTime()}, 30000); 
    }

    addEventListenerAll(element, events, func){
        events.forEach(event => {element.addEventListener(event, func, false);})
    }

    getLastValue(i){return this._memory[this._memory.length - i]}
    getLastIndex(i){return this._memory.length - i}
    getResult(){
        let result = eval(this._memory.join(' '));
        if(result.toString().length > 10){result = result.toFixed(8)};
        this._memory = [result.toString()]
    }

    addEntry(value){
        if((value === '.') && (isNaN(this.getLastValue(1) || this._memory.length === 0))){
            this._memory.push('0.')
        }
        else if(this._memory.length === 0 && !isNaN(value)){
            this._memory.push(value);
        }
        else if(!isNaN(this.getLastValue(1)) && (!isNaN(value) || value === '.')){
            this._memory[this.getLastIndex(1)] = this.getLastValue(1) + value; 
        }
        else if(isNaN(this.getLastValue(1)) && isNaN(value)){
            this._memory[this.getLastIndex(1)] = value
        }
        else if(this._temp && isNaN(value)){
            this.getResult()
            this._memory.push(value);
            this._temp = false;
        }
        else{
            this._memory.push(value);
            this._temp = true;
        }  
    }

    execBtn(value){
        if(value === 'ac'){this._memory = []}

        else if(value === 'ce'){
            let lastInd = this.getLastIndex(1);
            if(this._memory[lastInd].length === 1){this._memory.pop()}
            else{this._memory[lastInd] = this._memory[lastInd].slice(0, -1)}
        }

        else if(Object.keys(this.entrys).includes(value)){this.addEntry(this.entrys[value])}

        else if(value === 'igual'){
            this.getResult();
            this._resetMemory = true;
        }

        else{
            if(this._resetMemory === true){
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

    setDisplaDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this.locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale, {hour: '2-digit', minute:'2-digit'});
    }

    get displayTime(){return this._timeEl}
    set displayTime(value){this._timeEl.innerHTML = value}

    get displayDate(){return this._dateEl}
    set displayDate(value){this._dateEl.innerHTML = value}

    get displayCalc(){return this._displayCalcEl}
    set displayCalc(value){this._displayCalcEl.innerHTML = value}

    get currentDate(){return new Date()}
    set currentDate(value){this._currentDate = value}
};