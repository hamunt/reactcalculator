import React from 'react';
import './App.css';
import *as math from 'mathjs';

// utilities
const numberKeys = [7,8,9,4,5,6,1,2,3,0,'.']; // this is for the sake of the grid arrangements
const specialOperationKeys = [
  {id: 'clear', operation: 'C'},
  {id: 'root', operation: '∫'},
  {id: 'square', operation: 'X²'},
  {id: 'cancel', operation: '<='}
];
const operationKeys = [
  {id: 'divide', operation: '/'},
  {id: 'multiply', operation: '*'},
  {id: 'sub', operation: '-'},
  {id: 'sum', operation: '+'}
];
let decimalAppend = true;


function PrevData(props){
  return(
    <div style={{fontWeight: "lighter"}}>
      {props.results}
    </div>
  );
}
function CurrentData(props){
  return(
    <div>
      {props.currentOperand}
    </div>
  );
}

class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      results: '',
      currentOperand: ''
    };
    this.addNumber = this.addNumber.bind(this);
    this.handleOperation = this.handleOperation.bind(this);
    this.handleSpecialOperation = this.handleSpecialOperation.bind(this);
    this.calculate = this.calculate.bind(this);
  }
  addNumber(event){
    // if the decimal false and the user clicks it the function should return
    if(!decimalAppend && event.target.value === '.'){
      return;
    }

    this.setState({
      currentOperand: this.state.currentOperand + event.target.value
    });

    // set the decimal append to false when the it appended
    if(event.target.value === '.'){decimalAppend =false}
  }
  handleOperation(event){
    const {value} = event.target; // es6 object distructuring
    // avoid adding operation key twice consecutively!
    if(this.state.currentOperand.toString().charAt(this.state.currentOperand.toString().length -1) === value){return}
    if(isNaN(this.state.currentOperand.toString().charAt(this.state.currentOperand.toString().length -1))){return}
    // avoid clicking / or * before a number
    if((this.state.results === "" && this.state.currentOperand ==="") && (value === '*' || value === '/')){ return}
    this.setState({
      currentOperand: this.state.currentOperand + value
    });
    decimalAppend = true;

  }
  handleSpecialOperation(event){
      const {value} = event.target; // es6 object distructuring
      switch(value){
        case 'C':
          this.setState({results: "", currentOperand: ""});
          break;
        case '∫':
          if(this.state.results === "" && this.state.currentOperand === ""){return}
          if(isNaN(this.state.currentOperand) || isNaN(this.state.results)){return} //avoid error of square root of non number!
          //return error for square root of a negative number
          if(this.state.currentOperand < 0 || this.state.results < 0){
            this.setState({results: "error", currentOperand : ""})
            return;
          }
          if(this.state.currentOperand === "" && this.state.results !== ""){
            this.setState({
              results: Math.sqrt(this.state.results)
            });
            return;
          }
          this.setState({
            results: Math.sqrt(this.state.currentOperand),
            currentOperand: ""
          });
          break;
        case 'X²':
          if(isNaN(this.state.currentOperand) || isNaN(this.state.results)){return} //avoid error of square of non number!
          if(this.state.results === "" && this.state.currentOperand === ""){return}
          if(this.state.currentOperand === "" && this.state.results !== ""){
            this.setState({
              results: Math.pow(this.state.results,2)
            });
            return;
          }
          this.setState({
            results: Math.pow(this.state.currentOperand,2),
            currentOperand: ""
          });
          break;
        case '<=':
          // you want to only be able to slice current operand and not results. right?
          this.setState({
            currentOperand: this.state.currentOperand.toString().slice(0,-1)
          });
          break;
        default:
          return;
      }
  }
  calculate(event){
        //disregard the results if the user doesnt type an operator first
        let currentOperandStr = this.state.currentOperand.toString().charAt(0);
        if(currentOperandStr !== '+' && currentOperandStr !== '-' && currentOperandStr !== '/' && currentOperandStr !== '*'){
          this.setState({results: ""})
        }else{
          if(this.state.currentOperand.length === 1){return}
        }

        // disable the click if the last in the string is an operator
        const str = `${this.state.results}${this.state.currentOperand}`;
        const lastChar = str.charAt(str.length - 1);
        if(lastChar === '*' || lastChar === '/' || lastChar === '+' || lastChar === '-'){
          return;
        }

        decimalAppend = true;
    try{ 
      // accessing state using a function will ensure that you are working with the most current state.        
      this.setState(state => ({
        results: math.evaluate(`${state.results}${state.currentOperand}`),//we are using mathjs library here
        currentOperand: ""
      })); 
    }catch(error){ // you don't want your app to crash when it encouters an error.
      this.setState(state =>({
        results: "error",
        currentOperand: ""
      }));
      // console.log(error);
    }
  }
  render(){
    // array mapping. You might want to revisit this powerful array method if you not familiar with it.
    const numKey = numberKeys.map((value,index) =>
                                <button 
                                onClick={this.addNumber}
                                value={value}
                                key={index}
                              >
                              {value}
                              </button>
                            );

    const specialOperateKey = specialOperationKeys.map((value,index) =>
                              <button
                              id={value.id}
                              value={value.operation}
                              onClick={this.handleSpecialOperation}
                              key={index}
                              >
                              {value.operation}
                              </button>
    ); 
    const OperateKey = operationKeys.map((value,index) =>
                              <button
                              id={value.id}
                              value={value.operation}
                              onClick={this.handleOperation}
                              key={index}
                              >
                              {value.operation}
                              </button>
      ); 

    return(
      <div className="container">
        <div id="name">React Calculator</div>
        <div id="screen">
          <PrevData results={this.state.results}/>
          <CurrentData currentOperand={this.state.currentOperand}/>
        </div>
        {numKey}
        {specialOperateKey}
        {OperateKey}
        <button key ={10} id="calculate" onClick={this.calculate}>=</button>

      </div>
    );
  }
}
export default Calculator;
