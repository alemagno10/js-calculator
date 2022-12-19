class CalcController {
    constructor(){
        this.entrys = {'igual': '=', 'multiplicacao': '*', 'divisao': '/', 'soma': '+', 'subtracao': '-', 'porcento': '%'};
        this._memory = [];
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
        setInterval(()=>{this.setDisplaDateTime()}, 60000); 
    }

    addEventListenerAll(element, events, func){
        events.forEach(event => {element.addEventListener(event, func, false);})
    }

    execBtn(value){
        if(value === 'ac'){this._memory = []}
        else if(value === 'ce'){this._memory.pop()}
        else if(Object.keys(this.entrys).includes(value)){this._memory.push(this.entrys[value])}
        else{this._memory.push(value)}
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