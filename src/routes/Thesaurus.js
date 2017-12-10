import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import * as api from "../utils/api";
const Words = require('../files/queue_collins_1.json')
const ThesaurusData = require('../files/thesaurus.json')
console.log('ThesaurusData', ThesaurusData);
class Thesaurus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    const list1 = require('../files/list_1.json');
    console.log('list1', list1);
    this.state = {
      currentList: list1,
      currentListIndex: 0,
      currentWord: list1[0],
      reviewList: [],
      reviewIndex: 0,
      reviewWord: null,
    }

  }

  componentWillMount() {
  }
  setCurrentWord = (index)=> {
    let {currentList, currentListIndex, currentWord,reviewList,reviewWord,reviewIndex} = this.state;
    currentListIndex = index
    currentWord = currentList[index]
    reviewList = Array.new
    const currentThesaurus = _.get(ThesaurusData, currentWord);
    const thesaurusWords = _.flattenDeep(_.values(currentThesaurus));
    reviewList = _.flatten(_.map(thesaurusWords, w => [currentWord, w]))
    console.log('thesaurusWords',this, currentThesaurus, reviewList)
    reviewIndex = 0
    reviewWord = reviewList&& reviewList[reviewIndex]

    // reviewList.pus

    if (currentWord) {
      this.setState({
        currentListIndex,
        currentWord,
        reviewList,
        reviewWord,
        reviewIndex
      })
    }
  }
  nextWord = ()=>{
    let {currentList, currentListIndex, currentWord} = this.state;
    this.setCurrentWord(currentListIndex + 1)
  }
  next = ()=>{
    let {currentList, currentListIndex, currentWord, reviewList,reviewIndex, reviewWord} = this.state;
    if (reviewList){
      reviewIndex += 1
      reviewWord = reviewList&& reviewList[reviewIndex]
      console.log('next', reviewList, reviewWord)


      if (reviewWord){
        this.setState({
          reviewIndex,
          reviewWord,
        }, this.getShanbay)
      } else {
        this.nextWord();
      }


    }
    // reviewList
    // this.setCurrentWord(currentListIndex + 1)
  }
  getShanbay = ()=> {
    const {reviewWord} = this.state;
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
    fetch(`/shanbay/api/v1/bdc/search/?word=${reviewWord}`, options)
      .then(r => r.json())
      .then((data)=>{
        console.log('getShanbay success,', data)
        let shanbay = data.data
        this.setState({
          shanbay
        })
      })
      .catch((error)=>{
        console.log('getShanbay error,', error)
      })

  }
  goToLastWord = ()=>{
    this.setCurrentWord(149)
  }
  goToFirstWord = ()=>{
    this.setCurrentWord(0)
  }
  renderShanbay = ()=> {
    const { shanbay} = this.state;
    return (
      <div>
        <div>content: {shanbay.content}</div>
        <div>pron: {shanbay.pron}</div>
        <div>definition: {shanbay.definition}</div>
        <div>us_audio: {shanbay.us_audio}</div>
        <div>en_definitions: {shanbay.en_definition.defn}</div>
      </div>
    )

  }
  render() {
    const {currentList, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay} = this.state;
    const currentThesaurus = _.get(ThesaurusData, currentWord);
    return (
      <div>
        <div>Words:{Words.length}</div>

        <div>ThesaurusData:{_.size(ThesaurusData)}</div>
        <div>
          <div>currentListIndex: {currentListIndex}</div>

          <div>CurrentWord: {currentWord}</div>

          <div>CurrentThesaurus: {JSON.stringify(currentThesaurus)}</div>
          <div>
            {
              _.map(currentThesaurus, (list_list, noun_or_verb) => {
                return (
                  <div>
                    <div>{noun_or_verb}</div>
                    {
                      _.map(list_list, (list, i) => {
                        return (
                          <div style={{display: 'flex', flexDirection: 'row'}}>
                            {/*<div>{i}</div>*/}
                            {
                              _.map(list, (word, i) => {
                                return (
                                  <div>
                                    {/*<div>{i}</div>*/}
                                    <div>,&nbsp;&nbsp; {word} </div>

                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                      })
                    }

                  </div>
                )
              })
            }
          </div>
        </div>

        <div>reviewIndex: {reviewIndex}</div>
        <div>CurrentReviewWord: {reviewWord}</div>
        <div>
          {
            shanbay ? this.renderShanbay(): null
          }

        </div>

        <div>
          <button onClick={this.goToFirstWord}>First Word</button>

          <button onClick={this.nextWord}>Next Word</button>
          <button onClick={this.next}>Next</button>
          <button onClick={this.goToLastWord}>Last Word</button>

        </div>

      </div>
    )
  }
}

export default connect()(Thesaurus);
