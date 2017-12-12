import * as api from '../utils/api';
// export async function getShanbay(params) {
//     return api.post(`/api/admin/v1/users/sign_in`,params);
// }
function saveToLocalStore(){
  localStorage.setItem('shanbayStore', JSON.stringify(shanbayStore))
}
var shanbayStoreJson = localStorage.getItem('shanbayStore')
var shanbayStore = null
try {
    if (!shanbayStoreJson){
      shanbayStore = {}      
      saveToLocalStore();
    } else {
      shanbayStore = JSON.parse(shanbayStoreJson)      
    }
  } catch (e){
    shanbayStore = {}
    console.log('parse JSON of localStorage[shanbayStore] error', e);

}

console.log('shanbayStore:', shanbayStoreJson, shanbayStore);

const ShanbayData = require('../files/shanbay.json')

export async function getShanbay(searchWord, callback) {
    // let {reviewWord, shanbayStore} = this.state;
    // searchWord = searchWord || reviewWord
    console.log('local Store', shanbayStore, searchWord)

    if (_.has(ShanbayData, searchWord)) {
      let shanbay = ShanbayData[searchWord]
      console.log('getShanbay from ShanbayData success,', ShanbayData,shanbay)

      if (callback){
        callback(searchWord, shanbay);
        }
      return
    }
    if (_.has(shanbayStore, searchWord)) {
      let shanbay = shanbayStore[searchWord]
      console.log('getShanbay from local Store success,', shanbayStore,shanbay)

      if (callback){
        callback(searchWord, shanbay);
        }
    } else {
      // const headers = getRequestHeaders(body, token);
      const headers = {'Accept': 'application/json'}
      // ? {'Accept': 'application/json', 'Content-Type': 'application/json'}
      // : {'Accept': 'application/json'};
      const method = 'get'
      const options =  {method, headers}
      // ? {method, headers, body: JSON.stringify(body)}
      // : {method, headers};


      // api.get('https://api.shanbay.com/bdc/search/', {word: reviewWord})
      // https://api.shanbay.com/api/v1/bdc/search/
      // fetch(`https://api.shanbay.com/api/v1/bdc/search/?word=${reviewWord}`, options)


      // fetch(`/shanbay/api/v1/bdc/search/?word=${reviewWord}`, options)
      postMessage({type:'fetch_shanbay', word: searchWord},'*')
      // fetch(`https://api.shanbay.com//api/v1/bdc/search/?word=${reviewWord}`, options)
      fetch(`/shanbay/api/v1/bdc/search/?word=${searchWord}`, options)

        .then(r => r.json())
        .then((data)=>{
          let shanbay = data.data
          console.log('getShanbay from api success,', shanbay)

          let word = searchWord || shanbay.content
          if (callback){
            callback(word, shanbay);
        }
          shanbayStore[word] = shanbay
        //   this.setState({
        //     shanbay,
        //     shanbayStore
        //   }, this.saveToLocalStore)
        
            saveToLocalStore();
        })
        .catch((error)=>{
          console.log('getShanbay error,', error)
        })
    }


  }