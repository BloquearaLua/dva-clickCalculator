import dva, { connect } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import React from 'react';
import styles from './index.less';

// 1. Initialize
const app = dva();

// 2. Model
// Remove the comment and define your model.
//app.model({});
app.model({
  namespace: 'count',
  state:{
    record:0,
    current:0,
  },
  reducers:{
    add(state){
      const newCurrent = state.record + 1;
      return {
        ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current:newCurrent,
      };
    },
    minus(state){
      return {...state,current:state.record-1};
    },
    clear(state){
      return {
        ...state,
        current:0,
        record:0,
      }
    }
  },
  effects:{
    *add(action,payload){
      console.log(payload);
      const {call,put} = payload;
      yield call(delay,1000);
      yield put({type:'minus'});
    },
  },
  // subscriptions:{
  //   keyboardWatcher({dispatch}){
  //     key('ctrl+up', ()=>{dispatch({type:'count/add'})})
  //   }
  // }
});
function delay(timeout) {
    return new Promise(resolve=>{
      setTimeout(resolve,timeout);
    });
}
// 3. Router
const CountApp = ({count,dispatch}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record：{count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.add}>
        <button className={styles.btn} onClick={()=>dispatch({type:'count/add'})}>+</button>
        <button className={styles.btn} onClick={()=>dispatch({type:'count/clear'})}>清空</button>
      </div>
    </div>
  );
};
const HomePage = connect(mapStateToProps)(CountApp);
function mapStateToProps(state) {
  return {
    count:state.count
  };
}
app.router(({ history }) =>
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={HomePage} />
    </Switch>
  </Router>
);

// 4. Start
app.start('#root');
